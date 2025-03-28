import { Request, Response } from "express";
import { errors, handleResponse, } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { NOTIFICATIONSETTING } from "../../../models/User/userNotificationSetting.model";

export const getUserNotificationSetting = async (req: Request, res: Response) => {
    try {
        const getUserNotificationSetting  = await NOTIFICATIONSETTING.findById(res.locals.userId, "-pauseall -_id" , {upsert: true})
        if (getUserNotificationSetting) {
            return handleResponse(res, 200, { USERSETTINGS: getUserNotificationSetting })
        }
        return handleResponse(res, 400, errors.user_notification_not_found);
    } catch (error: any) {
        sendErrorToDiscord('profile:GET', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};