import { Response, Request } from "express";
import Joi from "joi";
import { errors, handleResponse, Lang } from "../../utils/responseCodec";
import { validateNotificationQuery } from "../../validators/validators";
import { getAllFriendSuggestionAggregation } from "../../aggregation/getAllFriendSuggestion";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const getFriendSuggestion = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateNotificationQuery(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }
        const { page = 1, limit = 10 } = req.query;
        let friendSuggestion = await getAllFriendSuggestionAggregation(res.locals.userId, Number(page), Number(limit));
        if (friendSuggestion) {
            return handleResponse(res, 200, friendSuggestion);
        }
        return handleResponse(res, 404, errors.notification, lang);
    } catch (err: any) {
        sendErrorToDiscord("GET:get-friend-suggestion", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
