import { Request, Response } from "express";
import { errors, handleResponse, } from "../../../utils/responseCodec";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const getProfileDetails = await USER.findById(res.locals.userId, "name photo email dob username gender phone country")
        if (getProfileDetails) {
            return handleResponse(res, 200, { profileDetails: getProfileDetails })
        }
        return handleResponse(res, 400, errors.profile_not_found);
    } catch (error: any) {
        sendErrorToDiscord('GET:profile', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};