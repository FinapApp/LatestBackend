import { Request, Response } from "express";
import { errors, handleResponse, } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const getSel = async (req: Request, res: Response) => {
try {
        const getProfileDetails = await USER.findById(res.locals.userId, "name username followerCount followingCount flickCount")
        if (getProfileDetails) {
            return handleResponse(res, 200, { profileDetail : getProfileDetails })
        }
        return handleResponse(res, 400, errors.profile_not_found);
    } catch (error: any) {
        sendErrorToDiscord('GET:profile', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};