import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatusBatch } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";

export const bulkChangeStatus = async (req: Request, res: Response) => {
    const session = await QUEST_APPLICANT.startSession();
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatusBatch(req.query, req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questApplicantIds } = req.body;
        const { status } = req.query;
        if (status === "pending") {
            return handleResponse(res, 403, {
                message: "Status cannot be reverted back to pending once changed.",
            });
        }
        const applicants = await QUEST_APPLICANT.find({
            _id: { $in: questApplicantIds },
        })
            .populate("quest", "totalApproved leftApproved maxApplicants totalRejected applicantCount avgAmountPerPerson status")
            .select("status quest user isDeposited")
            .session(session);

        if (applicants.some(app => app.isDeposited)) {
            return handleResponse(res, 403, {
                message: "One or more applicants belong to a quest that is already deposited. Status changes are not allowed.",
            });
        }

        const questMap = new Map<string, {
            quest: any,
            applicants: typeof applicants,
        }>();

        for (const app of applicants) {
            const questId = app.quest._id.toString();
            if (!questMap.has(questId)) {
                questMap.set(questId, { quest: app.quest, applicants: [] });
            }
            questMap.get(questId)!.applicants.push(app);
        }

        const finalApplicantIdsToUpdate: string[] = [];
        const walletBulkOps: any[] = [];
        const questBulkOps: any[] = [];

        for (const [, { quest, applicants }] of questMap.entries()) {
            const questUpdate: any = { $inc: {}, $set: {} };
            let approvedDelta = 0;
            let rejectedDelta = 0;

            for (const app of applicants) {
                const prevStatus = app.status;

                // Prevent flick if no change
                if (prevStatus === status) continue;

                // Reverting back to pending is already blocked globally

                // 🔐 Approval cap check
                if (status === "approved" && prevStatus !== "approved") {
                    if (quest.leftApproved <= 0) {
                        return handleResponse(res, 403, errors.quest_applicant_approval);
                    }
                    approvedDelta++;
                    quest.leftApproved--; // simulate update
                    walletBulkOps.push({
                        updateOne: {
                            filter: { user: app.user },
                            update: { $inc: { reservedBalance: quest.avgAmountPerPerson } },
                            upsert: true,
                        },
                    });
                }

                // 🔓 If demoting from approved
                if (prevStatus === "approved" && status !== "approved") {
                    approvedDelta--;
                    quest.leftApproved++;
                    walletBulkOps.push({
                        updateOne: {
                            filter: { user: app.user },
                            update: { $inc: { reservedBalance: -quest.avgAmountPerPerson } },
                            upsert: true,
                        },
                    });
                }

                // ❌ Rejection cap logic
                const isRejection = status === "rejected";
                const isPreviouslyRejected = prevStatus === "rejected";

                if (isRejection && !isPreviouslyRejected) {
                    const totalRejected = quest.totalRejected + rejectedDelta + 1;
                    const remainingApplicants = quest.applicantCount - totalRejected;

                    const seventyPercent = Math.floor(quest.applicantCount * 0.7);
                    const rejectionThreshold = Math.min(seventyPercent, quest.maxApplicants);

                    if (remainingApplicants < rejectionThreshold) {
                        return handleResponse(res, 403, {
                            message: `Rejection cap exceeded. At least ${rejectionThreshold} applicants must remain after rejection.`,
                        });
                    }

                    rejectedDelta++;
                }

                // revert previous rejections
                if (prevStatus === "rejected" && status !== "rejected") {
                    rejectedDelta--;
                }

                finalApplicantIdsToUpdate.push(app._id.toString());
            }

            if (approvedDelta !== 0) {
                questUpdate.$inc.totalApproved = approvedDelta;
                questUpdate.$inc.leftApproved = -approvedDelta;
            }

            if (rejectedDelta !== 0) {
                questUpdate.$inc.totalRejected = rejectedDelta;
            }

            const projectedApproved = quest.totalApproved + approvedDelta;
            if (projectedApproved >= quest.maxApplicants) {
                questUpdate.$set.status = "completed";
            } else if (quest.status === "completed") {
                questUpdate.$set.status = "pending";
            }

            if (Object.keys(questUpdate.$inc).length > 0 || Object.keys(questUpdate.$set).length > 0) {
                questBulkOps.push({
                    updateOne: {
                        filter: { _id: quest._id },
                        update: questUpdate,
                    },
                });
            }
        }

        await session.withTransaction(async () => {
            if (finalApplicantIdsToUpdate.length > 0) {
                await QUEST_APPLICANT.updateMany(
                    { _id: { $in: finalApplicantIdsToUpdate } },
                    { $set: { status } },
                    { session }
                );
            }

            if (questBulkOps.length > 0) {
                await QUESTS.bulkWrite(questBulkOps, { session });
            }

            if (walletBulkOps.length > 0) {
                await WALLET.bulkWrite(walletBulkOps, { session });
            }
        });
        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error: any) {
        console.error("🔥 Error in bulkChangeStatus:", error);
        sendErrorToDiscord("PUT:bulk-quest-applicant-status", error);
        return handleResponse(res, error.code || 500, error.message || errors.catch_error);
    } finally {
        session.endSession();
    }
};


