import { Request, Response } from "express";
import { validateSignUp } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { sendOTPEmailVerification } from "../../utils/sendOTP_EmailVerification";
import { generateNumericOTP } from "../../utils/OTPGenerator";
import { redis } from "../../config/redis/redis.config";
import { config } from "../../config/generalconfig";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { sendOTPPhoneVerification } from "../../utils/sendOTP_PhoneVerification";

interface SignUpRequest {
    email: string;
    phone: string;
    name: string;
    username: string
}

export const signUp = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateSignUp(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { email, name, phone } = req.body as SignUpRequest;
        let OTP = generateNumericOTP();
        if (email) {
            await sendOTPEmailVerification(OTP, email, name)
        } else {
            await sendOTPPhoneVerification(OTP, phone)
        }
        await redis.set(`OTP:${email || phone}`, JSON.stringify({ OTP }), "EX", config.REDIS_EXPIRE_IN);  // when in resend otp we often dont have to search back again and again and cache could do the thing.
        return handleResponse(res, 200, success.otp_sent);
    } catch (err: any) {
        sendErrorToDiscord("POST:signup", err)
        return handleResponse(res, 500, errors.catch_error);
    }
};