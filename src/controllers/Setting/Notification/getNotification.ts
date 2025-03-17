import { Request, Response } from "express";
import { errors, handleResponse, } from "../../../utils/responseCodec";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const getNotificationSettings = async (req: Request, res: Response) => {
    try {
        const get  = await USER.findById(res.locals.userId, "name photo email dob surname username gender phone")
        if (getProfileDetails) {
            return handleResponse(res, 200, { PROFILEDETAILS: getProfileDetails })
        }
        return handleResponse(res, 200, errors.profile_not_found);
    } catch (error: any) {
        sendErrorToDiscord('profile:GET', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};