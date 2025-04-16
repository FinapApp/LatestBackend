import { Request, Response } from "express";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICATION } from "../../../models/Quest/questApplication.model";
import Joi from "joi";
import { validateGetQuests } from "../../../validators/validators";

export const getAllQuests = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetQuests(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { sort, low, high, mode } = req.query;
        const buildQuery: any = {
            populate: {
                path: "user",
                select: "name photo username"
            }
        };
        if(sort){
            if (sort == "date-asc" || sort == "date-desc") {
                buildQuery.sort = { createdAt: sort == "date-asc" ? 1 : -1 };
            }
            if(sort == "amount-desc" || sort == "amount-asc"){
                buildQuery.sort = { totalAmount: sort == "amount-asc" ? 1 : -1 };
            }
        }
        const query  =  {} as any
        if(low && high) {
            query.$and = [
                { totalAmount: { $gte: Number(low) } },
                { totalAmount: { $lte: Number(high) } }
            ];
        }
        if (mode) {
            query.mode = mode == "go" ? "GoFlick" :"OnFlick"
        }
        const data = await QUESTS.find(query, "-_a", buildQuery)
        const userApplications = await QUEST_APPLICATION.find({ user: res.locals.userId }, "-_id");
        const appliedQuestIds = new Set(userApplications.map(app => app.quest.toString()));

        // Merge info: mark each quest with `hasApplied: true/false`
        const mergedData = data.map(quest => {
            const questId = (quest._id as string); // Explicitly cast _id to string
            return {
                ...quest.toObject(),
                hasApplied: appliedQuestIds.has(questId.toString()),
            };
        });
        if (data) {
            return handleResponse(res,
                200,
                { quests: mergedData }
            );
        }
        return handleResponse(res, 404, errors.quest_not_found);
    } catch (err: any) {
        sendErrorToDiscord("GET:all-quests", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
