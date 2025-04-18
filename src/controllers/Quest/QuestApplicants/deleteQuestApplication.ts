import { Request, Response } from "express"
import Joi from "joi";
import { validateQuestId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";

export const deleteQuestApplication = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteQuestApplication = await QUEST_APPLICANT.findByIdAndDelete(req.params.questId)
        if (deleteQuestApplication) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.quest_deleted)
        }
        return handleResponse(res, 404, errors.quest_deleted)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
