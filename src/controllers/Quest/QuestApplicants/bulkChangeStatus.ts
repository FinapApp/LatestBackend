import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatusBatch } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";
import { sendNotificationKafka } from "../../../utils/sendNotificationKafka";

export const bulkChangeStatus = async (req: Request, res: Response) => {
    const lang = (req.query.lang as Lang) || "en";
    const session = await QUEST_APPLICANT.startSession();

    try {
        // Validate input
        const validationError: Joi.ValidationError | undefined =
            validateQuestApplicantStatusBatch(req.query, req.body , req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }

        const { questApplicantIds } = req.body;
        const { status } = req.query;
        const { questId } = req.params;

        if (status === "pending") {
            return handleResponse(res, 403, errors.quest_status_cannot_revert, lang);
        }

        // Get applicants for the quest
        const applicants = await QUEST_APPLICANT.find({
            _id: { $in: questApplicantIds },
            quest: questId
        })
            .select("status quest user isDeposited description title media")
            .session(session);

        if (!applicants.length) {
            return handleResponse(res, 404, "No applicants found for the quest", lang);
        }

        // Sanity check: all applicants belong to the same quest
        if (!applicants.every(a => a.quest.toString() === questId)) {
            return handleResponse(res, 400, "Applicants belong to different quests", lang);
        }

        // Get quest once
        const quest = await QUESTS.findById(questId)
            .select(
                "totalApproved leftApproved maxApplicants totalRejected applicantCount avgAmountPerPerson status"
            )
            .session(session);

        if (!quest) {
            return handleResponse(res, 404, "Quest not found", lang);
        }

        // Block if any applicant already deposited
        if (applicants.some(app => app.isDeposited)) {
            return handleResponse(res, 403, errors.quest_applicant_already_approved_bulk, lang);
        }

        // Prepare deltas and bulk operations
        const finalApplicantIdsToUpdate: string[] = [];
        const walletBulkOps: any[] = [];

        let approvedDelta = 0;
        let rejectedDelta = 0;

        for (const app of applicants) {
            const prevStatus = app.status;

            // Skip if same status
            if (prevStatus === status) continue;

            // Approval flow
            if (status === "approved" && prevStatus !== "approved") {
                if (quest.leftApproved <= 0) {
                    return handleResponse(res, 403, errors.quest_applicant_approval, lang);
                }
                approvedDelta++;
                quest.leftApproved--; // simulate
                walletBulkOps.push({
                    updateOne: {
                        filter: { user: app.user },
                        update: { $inc: { reservedBalance: quest.avgAmountPerPerson } },
                        upsert: true
                    }
                });
            }

            // Demote from approved
            if (prevStatus === "approved" && status !== "approved") {
                approvedDelta--;
                quest.leftApproved++;
                walletBulkOps.push({
                    updateOne: {
                        filter: { user: app.user },
                        update: { $inc: { reservedBalance: -quest.avgAmountPerPerson } },
                        upsert: true
                    }
                });
            }

            // Rejection rules
            const isRejection = status === "rejected";
            const wasRejected = prevStatus === "rejected";

            if (isRejection && !wasRejected) {
                const totalRejected = quest.totalRejected + rejectedDelta + 1;
                const remainingApplicants = quest.applicantCount - totalRejected;
                const seventyPercent = Math.floor(quest.applicantCount * 0.7);
                const rejectionThreshold = Math.min(seventyPercent, quest.maxApplicants);

                if (remainingApplicants < rejectionThreshold) {
                    return handleResponse(
                        res,
                        403,
                        `Rejection cap exceeded. At least ${rejectionThreshold} applicants must remain after rejection.`,
                        lang
                    );
                }
                rejectedDelta++;
            }

            // Undo previous rejection
            if (prevStatus === "rejected" && status !== "rejected") {
                rejectedDelta--;
            }

            finalApplicantIdsToUpdate.push(app._id.toString());
        }

        // Prepare quest update
        const questUpdate: any = { $inc: {}, $set: {} };
        if (approvedDelta) {
            questUpdate.$inc.totalApproved = approvedDelta;
            questUpdate.$inc.leftApproved = -approvedDelta;
        }
        if (rejectedDelta) {
            questUpdate.$inc.totalRejected = rejectedDelta;
        }

        const projectedApproved = quest.totalApproved + approvedDelta;
        if (projectedApproved >= quest.maxApplicants) {
            questUpdate.$set.status = "completed";
        } else if (quest.status === "completed") {
            questUpdate.$set.status = "pending";
        }

        // Transaction
        await session.withTransaction(async () => {
            if (finalApplicantIdsToUpdate.length) {
                await QUEST_APPLICANT.updateMany(
                    { _id: { $in: finalApplicantIdsToUpdate } },
                    { $set: { status } },
                    { session }
                );
            }
            if (Object.keys(questUpdate.$inc).length || Object.keys(questUpdate.$set).length) {
                await QUESTS.updateOne({ _id: questId }, questUpdate, { session });
            }
            if (walletBulkOps.length) {
                await WALLET.bulkWrite(walletBulkOps, { session });
            }
        });

        // Kafka notification
        const kafkaMessages = {
            userId: res.locals.userId,
            metadata: {
                questId,
                questAppliedUsers: applicants.map(app => app.user.toString()),
                title: applicants.map(app => app.title).join(", ") || "",
                description: quest.description || "",
                status,
                thumbnailURL: quest.media?.[0]?.thumbnailURL || "",
            }   
        };
        sendNotificationKafka("QUEST_APPLICANT_STATUS_CHANGE_BULK", kafkaMessages);
        return handleResponse(res, 200, success.quest_applicant_approved, lang);
    } catch (error: any) {
        console.error("🔥 Error in bulkChangeStatus:", error);
        sendErrorToDiscord("PUT:bulk-quest-applicant-status", error);
        return handleResponse(res, error.code || 500, error.message || errors.catch_error, lang);
    } finally {
        session.endSession();
    }
};
