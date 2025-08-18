import { Response, Request } from "express";
import Joi from "joi";
import { errors, handleResponse, Lang } from "../../utils/responseCodec";
import { getNotificationAggregation } from "../../aggregation/getNotificationAggregation";
import { validateNotificationQuery } from "../../validators/validators";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const getNotifications = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateNotificationQuery(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        let { page, limit = 10 } = req.query as any
        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;
        const NOTIFICATIONS = await getNotificationAggregation(res.locals.userId, skip , limit);
        if (NOTIFICATIONS) {
            return handleResponse(res, 200, { notification: NOTIFICATIONS });
        }
        return handleResponse(res, 404, errors.notification, lang);
    } catch (err: any) {
        console.log(err);
        sendErrorToDiscord('getNotifications', err);
        return handleResponse(res, 500, errors.catch_error, err);
    }
};
