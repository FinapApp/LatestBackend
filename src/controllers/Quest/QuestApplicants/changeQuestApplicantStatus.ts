import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";

export const changeQuestApplicantStatus = async (req: Request, res: Response) => {
    console.info("🔄 [changeQuestApplicantStatus] Request received with params:", req.params, "and query:", req.query);

    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatus(req.query, req.params);

        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { questApplicantId } = req.params;
        const { status } = req.query;

        const applicant = await QUEST_APPLICANT.findById(questApplicantId).select("status quest user isDeposited");
        if (!applicant) {
            return handleResponse(res, 404, errors.quest_applicant_not_found);
        }

        const quest = await QUESTS.findById(applicant.quest);
        if (!quest) {
            return handleResponse(res, 404, errors.quest_not_found);
        }

        // ❌ Block status changes if quest is deposited
        if (applicant.isDeposited) {
            return handleResponse(res, 403, {
                message: "Quest is already deposited. Status changes are not allowed.",
            });
        }

        const previousStatus = applicant.status;
        if (previousStatus === status) {
            return handleResponse(res, 200, success.status_changed_flicked);
        }

        // ❌ Disallow reverting to pending
        if ((previousStatus === "approved" || previousStatus === "rejected") && status === "pending") {
            return handleResponse(res, 403, {
                message: "Status cannot be reverted back to pending once changed.",
            });
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
                });
            }
        }

        // ✅ Approval cap check
        if (
            status === "approved" &&
            previousStatus !== "approved" &&
            quest.leftApproved <= 0
        ) {
            return handleResponse(res, 403, errors.quest_applicant_approval);
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

            // ✅ Wallet updates
            if (previousStatus === "approved" && status !== "approved") {
                await WALLET.findOneAndUpdate(
                    { user: applicant.user },
                    { $inc: { reservedBalance: -quest.avgAmountPerPerson } },
                    { session , upsert: true}
                );
            } else if (previousStatus !== "approved" && status === "approved") {
                await WALLET.findOneAndUpdate(
                    { user: applicant.user },
                    { $inc: { reservedBalance: quest.avgAmountPerPerson } },
                    { session, upsert : true}
                );
            }
        });

        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        console.error("🔥 [Error] Exception in changeQuestApplicantStatus:", error);
        sendErrorToDiscord("PUT:quest-change-status-applicant", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};