import { Response, Request } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
import { getNotificationAggregation } from "../../aggregation/getNotificationAggregation";
import { validateNotificationQuery } from "../../validators/validators";

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateNotificationQuery(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const NOTIFICATIONS = await getNotificationAggregation(res.locals.userId, req.query.skip as string);
        if (NOTIFICATIONS) {
            return handleResponse(res, 200, NOTIFICATIONS);
        }
        return handleResponse(res, 404, errors.notification)
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error, err);
    }
};
