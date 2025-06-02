import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";

export const changeQuestApplicantStatus = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatus(req.query, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { questApplicantId } = req.params;
        const { status } = req.query;

        // Step 1: Find the applicant
        const applicant = await QUEST_APPLICANT.findById(questApplicantId, { status: 1, quest: 1 });
        if (!applicant) return handleResponse(res, 404, errors.quest_applicant_not_found);
        if (applicant.status !== "pending") {
            return handleResponse(res, 400, {
                message: `Applicant is already ${applicant.status}. Only pending applicants can be updated.`,
            });
        }

        // Step 2: Find the quest
        const quest = await QUESTS.findById(applicant.quest, "totalApproved leftApproved totalRejected  applicantCount") 
        if (!quest) return handleResponse(res, 404, errors.quest_not_found);

        // 💡 Rejection constraint — totalRejected must not exceed 30% of applicantCount
        if (status === "rejected") {
            const projectedRejectionRate = (quest.totalRejected + 1) / (quest.applicantCount || 1);
            if (projectedRejectionRate > 0.3) {
                return handleResponse(res, 403, {
                    message: `Rejection cap reached. Max 30% of ${quest.applicantCount} applicants can be rejected.`,
                });
            }
        }
        // ✅ Approval check
        if (status === "approved" && quest.leftApproved <= 0) {
            return handleResponse(res, 403, errors.quest_applicant_approval);
        }

        // Step 3: Update the applicant
        const updatedApplicant = await QUEST_APPLICANT.findByIdAndUpdate(
            questApplicantId,
            { status },
            { new: true, projection: { quest: 1, _id: 0 } }
        );
        if (!updatedApplicant) return handleResponse(res, 500, errors.status_changed_flicked);

        // Step 4: Update quest counters
        const updateQuery: any = { $inc: {} };
        if (status === "approved") {
            updateQuery.$inc.totalApproved = 1;
            updateQuery.$inc.leftApproved = -1;
        } else if (status === "rejected") {
            updateQuery.$inc.totalRejected = 1;
        }

        await QUESTS.findByIdAndUpdate(updatedApplicant.quest, updateQuery);

        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("PUT:quest-change-status-applicant", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
