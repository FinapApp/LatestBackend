import { Request, Response } from "express";
import { errors, handleResponse, Lang, } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { NOTIFICATIONSETTING } from "../../../models/User/userNotificationSetting.model";

export const getUserNotificationSetting = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const getUserNotificationSetting  = await NOTIFICATIONSETTING.findById(res.locals.userId, "-pauseall -_id" , {upsert: true})
        if (getUserNotificationSetting) {
            return handleResponse(res, 200, { notificationSetting : getUserNotificationSetting })
        }
        return handleResponse(res, 400, errors.user_notification_not_found  , lang);
    } catch (error: any) {
        sendErrorToDiscord('profile:GET', error);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};