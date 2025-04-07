import { Request, Response } from "express";
import { errors, handleResponse, } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USERBIOLINKS } from "../../models/User/userBioLinks";
import Joi from "joi";
import { validateGetProfileDetail } from "../../validators/validators";

export const getProfileDetailById = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetProfileDetail(
            req.params
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const { userId } = req.params;
        const [getProfileDetails, bioLink] = await Promise.all([
            USER.findById(userId, "name username followerCount followingCount flickCount description -_id"),
            USERBIOLINKS.find({ user: userId }, "title url")
        ]);
        if (getProfileDetails && bioLink) {
            return handleResponse(res, 200, { profileDetail: getProfileDetails, bioLinks: bioLink });
        }
        return handleResponse(res, 400, errors.profile_not_found);
    } catch (error: any) {
        sendErrorToDiscord('GET:profile', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};