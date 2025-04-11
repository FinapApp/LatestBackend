import { Response, Request } from "express";
import { validateUpdateProfile } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { HASHTAGS } from "../../../models/User/userHashTag.model";


export const updateProfileDetails = async (req: Request, res: Response) => {
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
        const { newHashTags, ...rest } = req.body;
        if (newHashTags) {
            const createHashTags = await HASHTAGS.insertMany(newHashTags.map((tag: { id: string, value: string }) => ({ value: tag.value, _id: tag.id })));
            if (!createHashTags) {
                return handleResponse(res, 404, errors.create_hashtags);
            }
        }
        const updateProfile = await USER.findByIdAndUpdate(
            res.locals.userId,
            rest,
            { new: true }
        );
        if (updateProfile) {
            return handleResponse(res, 200, success.profile_updated);
        }
        return handleResponse(res, 304, errors.profile_not_updated);
    } catch (err: any) {
        if (err.code == "11000" && err.keyValue.email) {
            return handleResponse(res, 500, errors.email_exist);
        }
        if (err.code == "11000" && err.keyValue.username) {
            return handleResponse(res, 500, errors.username_exist);
        }
        sendErrorToDiscord("PUT:profile", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
