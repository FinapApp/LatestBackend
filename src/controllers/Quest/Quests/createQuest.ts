import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { validateCreateQuest } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";

export const createQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateQuest(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const questId = req.params.questId;
        const quest = await QUESTS.create({
            _id: questId,
            user,
            gps : {
                type: "Point",
                coordinates: [req.body.coords.long , req.body.coords.lat]
            },
            ...req.body
        });
        if (!quest) {
            return handleResponse(res, 404, errors.quest_not_found);
        }
        return handleResponse(res, 200, success.quest_uploaded);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};