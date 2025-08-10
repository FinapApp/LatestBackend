import { Response, Request } from "express";
import { validateUpdateQuestApplicant } from "../../../validators/validators";
import { handleResponse, errors, success, Lang } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";

export const updateQuestApplicant = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateQuestApplicant(
            req.body, req.params , req.query
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                lang,
                validationError.details
            );
        }
        const user = res.locals.userId;
        const check = await QUEST_APPLICANT.findOne({ _id: req.params.questApplicantId, user }, "status")
        if (!check) return handleResponse(res, 404, errors.quest_applicant_not_found , lang);
        if (check.status == "approved") {
            return handleResponse(res, 403, errors.unable_to_update_quest_after_approval , lang);
        }
        const updateQuest = await QUEST_APPLICANT.findOneAndUpdate(
            {
                _id: req.params.questApplicantId,
                user
            },
            req.body,
            { new: true }
        );
        if (updateQuest) {
            return handleResponse(res, 200, success.quest_applicant_updated , lang);
        }
        return handleResponse(res, 400, errors.update_quest_applicants , lang);
    } catch (err: any) {
        console.error(err);
        sendErrorToDiscord("PUT:update-quest-applicant", err);
        return handleResponse(res, 500, errors.catch_error , lang);
    }
};
