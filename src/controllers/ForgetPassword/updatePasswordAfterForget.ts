import { Response, Request } from "express";
import { validateUpdatePasswordAfterOTP } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USER } from "../../models/User/user.model";
import { redis } from "../../config/redis/redis.config";
import { VerifyOTPForgetPasswordRequest } from "./verifyOTPForgetPassword";
import bcrypt from "bcryptjs";

export const updatePasswordAfterOTP = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdatePasswordAfterOTP(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { email, username, phone, password } = req.body as VerifyOTPForgetPasswordRequest;
        const identifier = email || username || phone;

        if (!identifier) {
            return handleResponse(res, 400, errors.identifier_not_found);
        }

        const redisData = await redis.get(`FORGET-PASSWORD:${identifier}`);
        if (!redisData) {
            return handleResponse(res, 400, errors.otp_expired);
        }

        let parsedData: { _id: string; OTP?: string };
        try {
            parsedData = JSON.parse(redisData);
        } catch {
            return handleResponse(res, 400, errors.otp_expired);
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
            return handleResponse(res, 400, errors.password_not_updated);
        }

        await redis.del(`FORGET-PASSWORD:${identifier}`);

        return handleResponse(res, 200, success.password_updated);
    } catch (err: any) {
        console.log(err);
        sendErrorToDiscord("PUT:update-password-after-otp", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
