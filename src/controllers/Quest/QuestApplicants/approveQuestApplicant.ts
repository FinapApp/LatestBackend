import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICATION } from "../../../models/Quest/questApplication.model";
import { validateQuestApplicantId } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";

export const changeStatusForQuestApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questApplicantId } = req.params;
        const updateQuestApplicant = await QUEST_APPLICATION.findByIdAndUpdate(questApplicantId, { status : 'approved' }, { new: true, projection: { quest: 1 , _id: 0  } });
        if (updateQuestApplicant) {
            await QUESTS.findByIdAndUpdate(updateQuestApplicant.quest, { $inc: { totalApproved: 1, leftApproved: -1 } });
            return handleResponse(res, 200, success.status_changed_flicked);
        }
        return handleResponse(res, 500, errors.status_changed_flicked);
    } catch (error) {
        sendErrorToDiscord("change-status-applicant", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};