import { Response, Request } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
import { validateNotificationQuery } from "../../validators/validators";
import { getAllFriendSuggestionAggregation } from "../../aggregation/getAllFriendSuggestion";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const getFriendSuggestion = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateNotificationQuery(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const friendSuggestion = await getAllFriendSuggestionAggregation(res.locals.userId);
        if (friendSuggestion) {
            return handleResponse(res, 200, { friendSuggestion });
        }
        return handleResponse(res, 404, errors.notification)
    } catch (err: any) {
        sendErrorToDiscord("GET:get-friend-suggestion", err);
        return handleResponse(res, 500, errors.catch_error, err);
    }
};
