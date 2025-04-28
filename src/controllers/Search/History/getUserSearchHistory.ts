import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { validateGetSearchHistory } from "../../../validators/validators";
import { SEARCHHISTORY } from "../../../models/SearchHistory/searchHistory.model";


export const getUserSearchHistory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetSearchHistory(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        let { limit = 10, page = 1 } = req.query as {
            limit?: number;
            page?: number;
        };
        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;
        console.log("skip", skip);
        const userId = res.locals.userId;
        const searchHistory = await SEARCHHISTORY.find({ user: userId }).populate([{
            path: "userSearched",
            select: "_id name username photo",
        },
        {
            path: "user",
            select: "_id name username photo",
        },
        {
            path: "flick",
            select: "_id thumbnailURL",
        },
        {
            path: "quest",
            select: "_id media[0].thumbnailURL",
        },
        {
            path: "hashTag",
            select: "_id value",
        },
        ]).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
        if (searchHistory.length > 0) {
            return handleResponse(res, 200, { searchHistory });
        }
        return handleResponse(res, 404, errors.search_history_not_found);
    } catch (error) {
        console.log("error", error);
        sendErrorToDiscord("GET:get-hash-ids", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};