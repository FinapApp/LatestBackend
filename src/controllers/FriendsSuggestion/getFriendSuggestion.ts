import { Response, Request } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
import { validateNotificationQuery } from "../../validators/validators";
import { getAllFriendSuggestionAggregation } from "../../aggregation/getAllFriendSuggestion";

export const getFriendSuggestion = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateNotificationQuery(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const FRIENDSUGGESTIONS = await getAllFriendSuggestionAggregation(res.locals.userId);
        if (FRIENDSUGGESTIONS) {
            return handleResponse(res, 200, { FRIENDSUGGESTIONS });
        }
        return handleResponse(res, 404, errors.notification)
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error, err);
    }
};
