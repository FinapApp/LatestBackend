import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";

export const changeQuestApplicantStatus = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang|| 'en';
    console.info("🔄 [changeQuestApplicantStatus] Request received with params:", req.params, "and query:", req.query);

    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatus(req.query, req.params);

        if (validationError) {
            return handleResponse(res, 400, errors.validation, 'en' , validationError.details);
        }

        const { questApplicantId } = req.params;
        const { status } = req.query;

        const applicant = await QUEST_APPLICANT.findById(questApplicantId).select("status quest user isDeposited description title media");
        if (!applicant) {
            return handleResponse(res, 404, errors.quest_applicant_not_found, lang);
        }

        const quest = await QUESTS.findById(applicant.quest);
        if (!quest) {
            return handleResponse(res, 404, errors.quest_not_found, lang);
        }

        // ❌ Block status changes if quest is deposited
        if (applicant.isDeposited) {
            return handleResponse(res, 403, errors.quest_applicant_had_already_won, lang);
        }

        const previousStatus = applicant.status;
        if (previousStatus === status) {
            return handleResponse(res, 200, success.status_changed_flicked, lang);
        }

        // ❌ Disallow reverting to pending
        if ((previousStatus === "approved" || previousStatus === "rejected") && status === "pending") {
            return handleResponse(res, 403, errors.quest_status_cannot_revert, lang);
        }

        // ✅ Rejection cap using dynamic formula
        if (status === "rejected") {
            const isAlreadyRejected = previousStatus === "rejected";
            const totalRejected = quest.totalRejected + (isAlreadyRejected ? 0 : 1);
            const remainingApplicants = quest.applicantCount - totalRejected;

            const seventyPercentOfApplicants = Math.floor(quest.applicantCount * 0.7);

            const rejectionThreshold = seventyPercentOfApplicants >= quest.maxApplicants
                ? quest.maxApplicants
                : seventyPercentOfApplicants;

            if (remainingApplicants < rejectionThreshold) {
                return handleResponse(res, 403, {
                    message: `Rejection cap exceeded. At least ${rejectionThreshold} applicants must remain after rejection.`,
                }, lang);
            }
        }

        // ✅ Approval cap check
        if (
            status === "approved" &&
            previousStatus !== "approved" &&
            quest.leftApproved <= 0
        ) {
            return handleResponse(res, 403, errors.quest_applicant_approval, lang);
        }

        // ✅ Start transaction
        const session = await QUEST_APPLICANT.startSession();
        await session.withTransaction(async () => {
            await QUEST_APPLICANT.findByIdAndUpdate(
                questApplicantId,
                { status },
                { session }
            );

            const questUpdate: any = { $inc: {}, $set: {} };

            // Revert previous status effects
            if (previousStatus === "approved") {
                questUpdate.$inc.totalApproved = -1;
                questUpdate.$inc.leftApproved = 1;
            } else if (previousStatus === "rejected") {
                questUpdate.$inc.totalRejected = -1;
            }

            // Apply new status effects
            if (status === "approved") {
                questUpdate.$inc.totalApproved = (questUpdate.$inc.totalApproved || 0) + 1;
                questUpdate.$inc.leftApproved = (questUpdate.$inc.leftApproved || 0) - 1;
            } else if (status === "rejected") {
                questUpdate.$inc.totalRejected = (questUpdate.$inc.totalRejected || 0) + 1;
            }

            // Update quest status if needed
            const projectedApproved =
                quest.totalApproved
                - (previousStatus === "approved" ? 1 : 0)
                + (status === "approved" ? 1 : 0);

            if (projectedApproved >= quest.maxApplicants) {
                questUpdate.$set.status = "completed";
            } else if (quest.status === "completed") {
                questUpdate.$set.status = "pending";
            }

            await QUESTS.findByIdAndUpdate(quest._id, questUpdate, { session });
            const kafkaMessages  = []
            // ✅ Wallet updates
            if (previousStatus === "approved" && status !== "approved") {
                kafkaMessages.push({
                    key: `QUEST_APPLICANT_STATUS_CHANGE`,
                    value: {
                        userId : res.locals.userId,
                        contentUserId: applicant.user.toString(),
                        metadata: {
                            questId: quest._id.toString(),
                            title: quest.title,
                            description: quest.description,
                            status: "rejected",
                            thumbnailURL: quest.media[0]?.thumbnailURL || "",
                        },
                        timestamp: new Date().toISOString(),
                    }
                }); 
                await WALLET.findOneAndUpdate(
                    { user: applicant.user },
                    { $inc: { reservedBalance: -quest.avgAmountPerPerson } },
                    { session , upsert: true }
                );
            } else if (previousStatus !== "approved" && status === "approved") {
                kafkaMessages.push({
                    key: `QUEST_APPLICANT_STATUS_CHANGE`,
                    value: {
                        userId: applicant.user,
                        contentUserId: quest.user.toString(),
                        metadata: {
                            questId: applicant.quest.toString(),
                            title: applicant.title,
                            description: applicant.description,
                            status: "approved",
                            thumbnailURL: applicant?.media[0]?.thumbnail || "",
                        },
                        timestamp: new Date().toISOString(),
                    }
                });
                await WALLET.findOneAndUpdate(
                    { user: applicant.user },
                    { $inc: { reservedBalance: quest.avgAmountPerPerson } },
                    { session, upsert : true}
                );
            }
        });
        return handleResponse(res, 200, success.status_changed_flicked, lang);
    } catch (error) {
        console.error("🔥 [Error] Exception in changeQuestApplicantStatus:", error);
        sendErrorToDiscord("PUT:quest-change-status-applicant", error);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};