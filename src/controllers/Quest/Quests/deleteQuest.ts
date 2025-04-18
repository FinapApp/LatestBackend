import { Request, Response } from "express"
import Joi from "joi";
import {  validateQuestId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";

export const deleteQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteQuest = await QUESTS.findByIdAndDelete(req.params.questId)
        if (deleteQuest) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.quest_deleted)
        }
        return handleResponse(res, 404, errors.quest_deleted)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
