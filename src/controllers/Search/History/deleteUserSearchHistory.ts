import { Request, Response } from "express"
import Joi from "joi";
import { validateUserSearchId } from "../../../validators/validators";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { SEARCHHISTORY } from "../../../models/SearchHistory/searchHistory.model";

export const deleteUserSearchHistory = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUserSearchId(req.params,req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const deleteSearchHistory = await SEARCHHISTORY.findByIdAndDelete(req.params.searchId)
        if (deleteSearchHistory) {
            return handleResponse(res, 200, success.search_history_deleted , lang)
        }
        return handleResponse(res, 404, errors.search_history_not_deleted, lang)
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-flick", error)
        return handleResponse(res, 500, errors.catch_error, lang)
    }
}
