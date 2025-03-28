import { Response, Request } from "express";
import { validateUpdateNotificationSetting } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { NOTIFICATIONSETTING } from "../../../models/User/userNotificationSetting.model";


export const updateNotificationSetting = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateNotificationSetting(
            req.body
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const updateNotificationSetting = await NOTIFICATIONSETTING.findByIdAndUpdate(
            res.locals.userId,
            req.body,
            { new: true, upsert: true }
        );
        if (updateNotificationSetting) {
            return handleResponse(res, 200, success.update_notification_setting);
        }
        return handleResponse(res, 400, errors.update_notification_setting);
    } catch (err: any) {
        await sendErrorToDiscord("profile-PUT", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
