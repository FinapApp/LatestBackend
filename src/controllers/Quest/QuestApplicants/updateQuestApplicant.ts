import { Response, Request } from "express";
import { validateUpdateQuestApplicant } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";

export const updateQuestApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateQuestApplicant(
            req.body, req.params
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const user = res.locals.userId;
        const check = await QUEST_APPLICANT.findOne({ _id: req.params.questApplicantId, user }, "status")
        if (!check) return handleResponse(res, 404, errors.quest_applicant_not_found)
        if (check.status == "approved") {
            return handleResponse(res, 403, errors.unable_to_update_quest_after_approval);
        }
        const updateQuest = await QUEST_APPLICANT.findOneAndUpdate(
            {
                _id: req.params.questApplicantId,
                user
            },
            req.body
        );
        if (updateQuest) {
            return handleResponse(res, 200, success.quest_applicant_updated);
        }
        return handleResponse(res, 400, errors.update_quest_applicants);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-quest-applicant", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
