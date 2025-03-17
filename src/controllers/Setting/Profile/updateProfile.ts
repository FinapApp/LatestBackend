import { Response } from "express";
import { validateUpdateProfile } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { AuthenticatedRequest } from "../../../types/AuthenticatedRequest.types";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";


export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateProfile(
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
        const updateProfile = await USER.findByIdAndUpdate(
            res.locals.userId,
            req.body
        );
        if (updateProfile) {
            return handleResponse(res, 200, success.profile_updated);
        }
        return handleResponse(res, 304, errors.profile_not_updated);
    } catch (err: any) {
        await sendErrorToDiscord("profile-PUT", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
