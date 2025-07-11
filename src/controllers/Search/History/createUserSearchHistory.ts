import { Request, Response } from 'express'
import { validateCreateUserSearchHistory } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { SEARCHHISTORY } from '../../../models/SearchHistory/searchHistory.model';

export const createUserSearchHistory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateUserSearchHistory(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { history } = req.body;
        const searchHistory = await SEARCHHISTORY.insertMany(history.map((history: any) => ({
            user: res.locals.userId,
            ...history
        })));
        if (searchHistory) {
            return handleResponse(res, 200, success.search_history_created)
        }
        return handleResponse(res, 500, errors.search_history_created);
    } catch (err) {
        sendErrorToDiscord("POST:create-feedback", err)
        return handleResponse(res, 500, errors.catch_error)
    }
}