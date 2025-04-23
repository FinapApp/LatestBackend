import { Response, Request } from "express";
import { validatePassword } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import bcrypt from "bcryptjs";
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
        const user = await USER.findById(res.locals.userId , "password")
        if (!user) {
            return handleResponse(res, 404, errors.user_not_found);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleResponse(res, 401, errors.incorrect_password);
        }
        user.password = newPassword;
        await user.save();
        return handleResponse(res, 200, success.password_updated);
    } catch (err: any) {
        await sendErrorToDiscord("PUT:password", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
