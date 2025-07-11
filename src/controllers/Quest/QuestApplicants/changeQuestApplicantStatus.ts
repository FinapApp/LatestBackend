import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";

export const changeQuestApplicantStatus = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatus(req.query, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questApplicantId } = req.params;
        const { status } = req.query;

        const applicant = await QUEST_APPLICANT.findById(questApplicantId).select("status quest user");
        if (!applicant) return handleResponse(res, 404, errors.quest_applicant_not_found);
        // if (applicant.status !== "pending") {
        //     return handleResponse(res, 400, {
        //         message: `Applicant is already ${applicant.status}. Only pending applicants can be updated.`,
        //     });
        // }
        const quest = await QUESTS.findById(applicant.quest).select("totalApproved leftApproved totalRejected applicantCount maxApplicants avgAmountPerPerson status");
        if (!quest) return handleResponse(res, 404, errors.quest_not_found);

        // ❌ Rejection cap
        if (status === "rejected") {
            const projectedRejectionRate = (quest.totalRejected + 1) / (quest.applicantCount || 1);
            if (projectedRejectionRate > 0.3) {
                return handleResponse(res, 403, {
                    message: `Rejection cap reached. Max 30% of ${quest.applicantCount} applicants can be rejected.`,
                });
            }
        }

        // ❌ No approval left
        if (status === "approved" && quest.leftApproved == 0) {
            return handleResponse(res, 403, errors.quest_applicant_approval);
        }
        // ✅ Step 1: Update applicant
        const updatedApplicant = await QUEST_APPLICANT.findByIdAndUpdate(
            questApplicantId,
            { status },
            { new: true, projection: { quest: 1, user: 1 } }
        );
        if (!updatedApplicant) return handleResponse(res, 500, errors.status_changed_flicked);

        // ✅ Step 2: Prepare quest update
        const updateQuery: any = { $inc: {} };
        if (status === "approved") {
            updateQuery.$inc.totalApproved = 1;
            updateQuery.$inc.leftApproved = -1;

            const projectedTotalApproved = quest.totalApproved + 1;
            if (projectedTotalApproved >= quest.maxApplicants) {
                updateQuery.$set = { status: "completed" };
            }
        } else if (status === "rejected") {
            updateQuery.$inc.totalRejected = 1;
        }

        // ✅ Step 3: Apply quest update
        await QUESTS.findByIdAndUpdate(updatedApplicant.quest, updateQuery);

        // ✅ Step 4: Update wallet
        if (status === "approved") {
            // First: always increment reservedBalance on approval
            await WALLET.findOneAndUpdate(
                { user: applicant.user },
                { $inc: { reservedBalance: quest.avgAmountPerPerson }}
            );

            // // Second: if quest is now completed, unlock all
            // if (shouldMarkCompleted) {
            //     const allApprovedApplicants = await QUEST_APPLICANT.find({
            //         quest: quest._id,
            //         status: 'approved'
            //     }, 'user');

            //     const walletBulkOps = allApprovedApplicants.map(app => ({
            //         updateOne: {
            //             filter: { user: app.user },
            //             update: {
            //                 $inc: {
            //                     availableBalance: quest.avgAmountPerPerson,
            //                     reservedBalance: -quest.avgAmountPerPerson,
            //                     totalEarning: quest.avgAmountPerPerson,
            //                     completedQuests: 1
            //                 }
            //             }
            //         }
            //     }));

            //     if (walletBulkOps.length > 0) {
            //         await WALLET.bulkWrite(walletBulkOps);
            //     }
            // }
        }

        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        console.error("Error in changeQuestApplicantStatus:", error);
        sendErrorToDiscord("PUT:quest-change-status-applicant", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
