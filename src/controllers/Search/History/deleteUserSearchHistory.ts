import { Request, Response } from "express"
import Joi from "joi";
import { validateUserSearchId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { SEARCHHISTORY } from "../../../models/SearchHistory/searchHistory.model";

export const deleteUserSearchHistory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUserSearchId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteSearchHistory = await SEARCHHISTORY.findByIdAndDelete(req.params.searchId)
        if (deleteSearchHistory) {
            return handleResponse(res, 200, success.search_history_deleted)
        }
        return handleResponse(res, 404, errors.search_history_not_deleted)
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-flick", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}
