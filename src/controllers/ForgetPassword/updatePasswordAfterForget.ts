import { Response, Request } from "express";
import { validateUpdatePasswordAfterOTP } from "../../validators/validators";
import { handleResponse, errors, success, Lang } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USER } from "../../models/User/user.model";
import { redis } from "../../config/redis/redis.config";
import { VerifyOTPForgetPasswordRequest } from "./verifyOTPForgetPassword";
import bcrypt from "bcryptjs";

export const updatePasswordAfterOTP = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdatePasswordAfterOTP(req.body ,req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }

        const { email, username, phone, password } = req.body as VerifyOTPForgetPasswordRequest;
        const identifier = email || username || phone;

        if (!identifier) {
            return handleResponse(res, 400, errors.identifier_not_found, lang);
        }

        const redisData = await redis.get(`FORGET-PASSWORD:${identifier}`);
        if (!redisData) {
            return handleResponse(res, 400, errors.otp_expired, lang);
        }

        let parsedData: { _id: string; OTP?: string };
        try {
            parsedData = JSON.parse(redisData);
        } catch {
            return handleResponse(res, 400, errors.otp_expired, lang);
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await USER.findByIdAndUpdate(
            parsedData._id,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return handleResponse(res, 400, errors.password_not_updated, lang);
        }

        await redis.del(`FORGET-PASSWORD:${identifier}`);

        return handleResponse(res, 200, success.password_updated, lang);
    } catch (err: any) {
        console.log(err);
        sendErrorToDiscord("PUT:update-password-after-otp", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
