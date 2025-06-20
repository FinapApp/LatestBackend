import { Request, Response } from "express"
import Joi from "joi";
import { validateQuestId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const deleteQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteQuest = await QUESTS.findOneAndDelete({ _id: req.params.questId, user: res.locals.userId }, { new: true });
        if (deleteQuest) {
            const questIndex = getIndex("QUESTS");
            await questIndex.deleteDocument(req.params.questId)
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.quest_deleted)
        }
        return handleResponse(res, 404, errors.quest_deleted)
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("DELETE:delete-quest", error);
        return handleResponse(res, 500, errors.catch_error)
    }
}
