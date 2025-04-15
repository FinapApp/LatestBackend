import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICATION } from "../../../models/Quest/questApplication.model";
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
        const applicant = await QUEST_APPLICATION.findById(questApplicantId, { quest: 1 });
        if (!applicant) {
            return handleResponse(res, 404, errors.quest_applicant_not_found);
        }

        // Step 2: Find the quest
        const quest = await QUESTS.findById(applicant.quest, "totalApproved leftApproved maxApplicants");
        if (!quest) {
            return handleResponse(res, 404, errors.quest_not_found);
        }

        if (status === "approved") {
            const minApprovalNeeded = Math.ceil(quest.maxApplicants * 0.3);
            const isEligible = quest.totalApproved >= minApprovalNeeded && quest.leftApproved > 0;

            if (!isEligible) {
                return handleResponse(res, 403, errors.quest_applicant_approval);
            }
        }

        const updateQuestApplicant = await QUEST_APPLICATION.findByIdAndUpdate(
            questApplicantId,
            { status },
            { new: true, projection: { quest: 1, _id: 0 } }
        );

        if (updateQuestApplicant) {
            const updateQuery: any = { $inc: {} };
            if (status === "approved") {
                updateQuery.$inc.totalApproved = 1;
                updateQuery.$inc.leftApproved = -1;
            } else if (status === "rejected") {
                updateQuery.$inc.totalRejected = 1;
                updateQuery.$inc.leftApproved = -1;
            }
            await QUESTS.findByIdAndUpdate(updateQuestApplicant.quest, updateQuery);
            return handleResponse(res, 200, success.status_changed_flicked);
        }

        return handleResponse(res, 500, errors.status_changed_flicked);
    } catch (error) {
        sendErrorToDiscord("change-status-applicant", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
