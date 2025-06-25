import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { validateChangeQuestStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";

export const changeQuestStatusClosed = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateChangeQuestStatus(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questId } = req.params;
        // Step 1: Find the quest
        const changeStatus = await QUESTS.findOneAndUpdate(
            { _id: questId, user: res.locals.userId },
            { status: "closed" },
            { new: true }
        );
        if (!changeStatus) {
            return handleResponse(res, 404, errors.quest_not_found);
        }
        const questPlain = changeStatus.toObject();
        const { user, media, description, ...restQuest } = questPlain;
        const questIndex = getIndex("QUESTS");
        await questIndex.addDocuments([
            {
                ...restQuest,
                questId,
                status: "closed",
            },
        ]);
        return handleResponse(res, 200, success.quest_status_closed);
    } catch (error) {
        sendErrorToDiscord("PATCH:quest-change-status-closed", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
