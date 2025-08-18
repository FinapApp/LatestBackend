import { Request, Response } from "express"
import Joi from "joi";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import { validateDeleteNotification } from "../../validators/validators";
import { NOTIFICATION } from "../../models/User/userNotification.model";

export const deleteNotification = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateDeleteNotification(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }
        const deleteNotification = await NOTIFICATION.findByIdAndDelete(req.params.notificationId)
        if (deleteNotification) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.notification_deleted, lang)
        }
        return handleResponse(res, 404, errors.notification_deleted, lang)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error, lang)
    }
}
