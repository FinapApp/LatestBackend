import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { validateChangeQuestStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";

export const changeQuestStatusClosed = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateChangeQuestStatus(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questId } = req.params;
        // Step 1: Find the quest
        const changeStatus = await QUESTS.findOneAndUpdate(
            { _id : questId, user: res.locals.userId },
            { status: "closed" },
            { new: true, projection: { status: 1, _id: 0 } }
        );
        if (!changeStatus) {
            return handleResponse(res, 404, errors.quest_not_found);
        }
        return handleResponse(res, 400, success.quest_status_closed);
    } catch (error) {
        sendErrorToDiscord("PATCH:quest-change-status-closed", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
