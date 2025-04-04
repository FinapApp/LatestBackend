import { Response,Request } from "express";
import {  validateUpdatePasswordAfterOTP } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USER } from "../../models/User/user.model";
import { redis } from "../../config/redis/redis.config";
import { VerifyOTPForgetPasswordRequest } from "./verifyOTPForgetPassword";

export const updatePasswordAfterOTP = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdatePasswordAfterOTP(
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
        const { email, username, phone,password } = req.body as VerifyOTPForgetPasswordRequest;
        // VERIFY OTP FROM THE REDIS

        const identifier = email || username || phone;
        const getOTP = await redis.get(`FORGET-PASSWORD:${identifier}`);
        if (!getOTP) {
            return handleResponse(res, 400, errors.otp_expired);
        }
        const filteredOTP = JSON.parse(getOTP as string)
        const updatePassword = await USER.findByIdAndUpdate(filteredOTP._id, { password }, { new: true })
        if (!updatePassword) {
            return handleResponse(res, 400, errors.password_not_updated);
        }
        await redis.del(`FORGET-PASSWORD:${identifier}`);
        return handleResponse(res, 200, success.password_updated);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-password-after-otp", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
