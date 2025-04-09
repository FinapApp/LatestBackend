import { Request, Response } from "express";
import { errors, handleResponse, } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USERBIOLINKS } from "../../models/User/userBioLinks";
import Joi from "joi";
import { validateGetProfileDetail } from "../../validators/validators";

export const getProfileDetail = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetProfileDetail(
            req.query
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        let { userId } = req.query as { userId?: string };
        userId = userId || res.locals.userId;
        const [getProfileDetails, bioLink] = await Promise.all([
            USER.findById(userId, "name username followerCount followingCount flickCount description photo  -_id" , {lean : true}),
            USERBIOLINKS.find({ user: userId }, "title url")
        ]);
        if (getProfileDetails && bioLink) {
            return handleResponse(res, 200, { profileDetail: { ...getProfileDetails, bioLink } });
        }
        return handleResponse(res, 400, errors.profile_not_found);
    } catch (error: any) {
        sendErrorToDiscord('GET:profile', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};