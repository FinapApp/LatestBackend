import { Request, Response } from "express";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestId } from "../../../validators/validators";
import Joi from "joi";

export const getAllQuestApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const data = await QUEST_APPLICANT.find({
            quest: req.params.questId
        }, "-_a", {
            populate: {
                path: "user",
                select: "name photo username"
            }
        });
        if (data) {
            return handleResponse(res,
                200,
                { quests: data }
            );
        }
        return handleResponse(res, 404, errors.quest_applicant_not_found);
    } catch (err: any) {
        sendErrorToDiscord("GET:all-quests-applicant", err);
        return handleResponse(res, 500, { message: "Internal Server Error" });
    }
};
