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
        const updateQuest = await   QUEST_APPLICANT.findByIdAndUpdate(
            req.params.questId,
            req.body
        );
        if (updateQuest) {
            return handleResponse(res, 200, success.update_quest);
        }
        return handleResponse(res, 400, errors.update_quest);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-quest", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
