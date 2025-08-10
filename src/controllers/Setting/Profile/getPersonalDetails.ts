import { Request, Response } from "express";
import { errors, handleResponse, Lang, } from "../../../utils/responseCodec";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const getProfileDetails = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const getProfileDetails = await USER.findById(res.locals.userId, "name photo email dob username gender phone country description updatedAt")
        if (getProfileDetails) {
            return handleResponse(res, 200, { profileDetails: getProfileDetails })
        }
        return handleResponse(res, 400, errors.profile_not_found , lang);
    } catch (error: any) {
        sendErrorToDiscord('GET:profile', error);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};


