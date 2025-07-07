import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatusBatch } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";

export const bulkChangeStatus = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatusBatch(req.query, req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { questApplicantIds } = req.body;
        const { status } = req.query;

        const applicants = await QUEST_APPLICANT.find({
            _id: { $in: questApplicantIds },
            status: 'pending'
        }).populate('quest', 'totalApproved leftApproved maxApplicants totalRejected applicantCount avgAmountPerPerson');

        const questMap = new Map<string, {
            quest: any,
            approvalCount: number,
            applicantIds: string[],
            approvedUserIds: string[]
        }>();

        for (const app of applicants) {
            const questId = app.quest._id.toString();
            if (!questMap.has(questId)) {
                questMap.set(questId, {
                    quest: app.quest,
                    approvalCount: 0,
                    applicantIds: [],
                    approvedUserIds: []
                });
            }
            const entry = questMap.get(questId)!;
            entry.applicantIds.push(app._id.toString());
            if (status === 'approved') {
                entry.approvalCount++;
                entry.approvedUserIds.push(app.user.toString());
            }
        }

        // 🔒 Rejection cap logic
        if (status === 'rejected') {
            for (const [, entry] of questMap) {
                const { totalRejected, applicantCount } = entry.quest;
                const projectedRejections = totalRejected + entry.applicantIds.length;
                const rejectionRate = projectedRejections / (applicantCount || 1);

                if (rejectionRate > 0.3) {
                    return handleResponse(res, 403, {
                        message: `Rejection cap reached. Max 30% of ${applicantCount} applicants can be rejected.`,
                    });
                }
            }
        }

        // ✅ Update applicant statuses
        await QUEST_APPLICANT.updateMany(
            { _id: { $in: questApplicantIds } },
            { $set: { status } }
        );

        const questBulkOps: any[] = [];
        const walletBulkOps: any[] = [];

        for (const [, entry] of questMap) {
            const update: any = { $inc: {} };
            const quest = entry.quest;

            if (status === 'approved') {
                update.$inc.totalApproved = entry.approvalCount;
                update.$inc.leftApproved = -entry.approvalCount;

                // 1️⃣ Credit reservedBalance for each newly approved user
                for (const userId of entry.approvedUserIds) {
                    walletBulkOps.push({
                        updateOne: {
                            filter: { user: userId },
                            update: { $inc: { reservedBalance: quest.avgAmountPerPerson } }
                        }
                    });
                }

                const projectedTotalApproved = quest.totalApproved + entry.approvalCount;

                // 2️⃣ If quest is completed, unlock all reserved to available
                if (projectedTotalApproved >= quest.maxApplicants) {
                    update.$set = { status: 'completed' };

                    const allApprovedApplicants = await QUEST_APPLICANT.find({
                        quest: quest._id,
                        status: 'approved'
                    }, 'user');

                    for (const applicant of allApprovedApplicants) {
                        walletBulkOps.push({
                            updateOne: {
                                filter: { user: applicant.user },
                                update: {
                                    $inc: {
                                        availableBalance: quest.avgAmountPerPerson,
                                        reservedBalance: -quest.avgAmountPerPerson,
                                        totalEarning: quest.avgAmountPerPerson,
                                        completedQuests: 1
                                    }
                                }
                            }
                        });
                    }
                }
            } else if (status === 'rejected') {
                update.$inc.totalRejected = entry.applicantIds.length;
            }

            questBulkOps.push({
                updateOne: {
                    filter: { _id: quest._id },
                    update
                }
            });
        }

        if (questBulkOps.length > 0) {
            await QUESTS.bulkWrite(questBulkOps);
        }

        if (walletBulkOps.length > 0) {
            await WALLET.bulkWrite(walletBulkOps);
        }

        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        console.error("Error in bulkChangeStatus: ", error);
        sendErrorToDiscord("bulk-change-status", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
