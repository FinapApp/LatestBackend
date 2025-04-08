import { Request, Response } from "express";
import { errors, handleResponse, } from "../../../utils/responseCodec";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const getProfileSetting = async (req: Request, res: Response) => {
    try {
        const profilesetting = await USER.findById(res.locals.userId, "username photo description")
        if (profilesetting) {
            return handleResponse(res, 200, { profilesetting })
        }
        return handleResponse(res, 400, errors.profile_not_found);
    } catch (error: any) {
        sendErrorToDiscord('GET:profile', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};


