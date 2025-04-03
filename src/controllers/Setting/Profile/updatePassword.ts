import { Response, Request } from "express";
import { validatePassword } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";

import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";


export const updatePassword = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePassword(
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
        const { password, newPassword } = req.body;
        const updateProfile = await USER.findByIdAndUpdate(
            { _id: res.locals.userId, password },
            { password: newPassword },
            { new: true }
        );
        if (updateProfile) {
            return handleResponse(res, 200, success.profile_updated);
        }
        return handleResponse(res, 304, errors.profile_not_updated);
    } catch (err: any) {
        await sendErrorToDiscord("PUT:password", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
