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

        await session.withTransaction(async () => {
            // Fetch applicants and their quests
            const applicants = await QUEST_APPLICANT.find({
                _id: { $in: questApplicantIds },
                status: 'pending'
            })
                .populate('quest', 'totalApproved leftApproved maxApplicants totalRejected applicantCount avgAmountPerPerson status')
                .session(session);

            const questMap = new Map<string, {
                quest: any,
                approvalCandidates: any[],
                rejectionCandidates: any[],
            }>();

            for (const app of applicants) {
                const quest = app.quest;
                const questId = quest._id.toString();

                if (!questMap.has(questId)) {
                    questMap.set(questId, {
                        quest,
                        approvalCandidates: [],
                        rejectionCandidates: [],
                    });
                }

                const entry = questMap.get(questId)!;

                if (status === 'approved') {
                    entry.approvalCandidates.push(app);
                } else if (status === 'rejected') {
                    entry.rejectionCandidates.push(app);
                }
            }

            const finalApplicantIdsToUpdate: string[] = [];
            const walletBulkOps: any[] = [];
            const questBulkOps: any[] = [];

            for (const [, entry] of questMap) {
                const quest = entry.quest;

                // ✅ Handle Rejection Cap
                if (status === 'rejected') {
                    const projectedRejections = quest.totalRejected + entry.rejectionCandidates.length;
                    const rejectionRate = projectedRejections / (quest.applicantCount || 1);
                    if (rejectionRate > 0.3) {
                        throw {
                            code: 403,
                            message: `Rejection cap reached. Max 30% of ${quest.applicantCount} applicants can be rejected.`,
                        };
                    }

                    finalApplicantIdsToUpdate.push(...entry.rejectionCandidates.map(a => a._id.toString()));

                    questBulkOps.push({
                        updateOne: {
                            filter: { _id: quest._id },
                            update: {
                                $inc: {
                                    totalRejected: entry.rejectionCandidates.length,
                                },
                            },
                        },
                    });
                }

                // ✅ Handle Approval Cap
                if (status === 'approved') {
                    const availableSlots = quest.maxApplicants - quest.totalApproved;
                    if (availableSlots <= 0) {
                        throw {
                            code: 403,
                            message: `No approval slots left for quest: ${quest._id}`,
                        };
                    }

                    const approvedSubset = entry.approvalCandidates.slice(0, availableSlots);

                    if (approvedSubset.length === 0) {
                        continue;
                    }

                    finalApplicantIdsToUpdate.push(...approvedSubset.map(a => a._id.toString()));

                    // Quest update
                    const questUpdate: any = {
                        $inc: {
                            totalApproved: approvedSubset.length,
                            leftApproved: -approvedSubset.length,
                        },
                    };

                    if (quest.totalApproved + approvedSubset.length >= quest.maxApplicants) {
                        questUpdate.$set = { status: 'completed' };
                    }

                    questBulkOps.push({
                        updateOne: {
                            filter: { _id: quest._id },
                            update: questUpdate,
                        },
                    });

                    // Wallet update
                    for (const app of approvedSubset) {
                        walletBulkOps.push({
                            updateOne: {
                                filter: { user: app.user },
                                update: { $inc: { reservedBalance: quest.avgAmountPerPerson } },
                            },
                        });
                    }
                }
            }

            // ✅ Update applicants
            if (finalApplicantIdsToUpdate.length > 0) {
                await QUEST_APPLICANT.updateMany(
                    { _id: { $in: finalApplicantIdsToUpdate } },
                    { $set: { status } },
                    { session }
                );
            }

            // ✅ Update quests
            if (questBulkOps.length > 0) {
                await QUESTS.bulkWrite(questBulkOps, { session });
            }

            // ✅ Update wallets
            if (walletBulkOps.length > 0) {
                await WALLET.bulkWrite(walletBulkOps, { session });
            }
        });

        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error: any) {
        console.error("Error in bulkChangeStatus:", error);
        sendErrorToDiscord("PUT:bulk-quest-applicant-status", error);
        return handleResponse(res, error.code || 500, error.message || errors.catch_error);
    } finally {
        session.endSession();
    }
};

