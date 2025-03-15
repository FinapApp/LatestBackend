import { Request, Response } from "express";
import { validateLogin, validateSignUp } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { sendOTPEmailVerification } from "../../utils/sendOTP_EmailVerification";
import { generateOTP } from "../../utils/OTPGenerator";
import { redis } from "../../config/redis/redis.config";
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";

interface SignUpRequest {
    email: string;
    name: string;
    username: string
}

export const signUp = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateSignUp(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { email, name, username } = req.body as SignUpRequest;
        const checkUser = await USER.findOne(
            { $or: [{ email }, { username }] },
            "email username"
        ).lean();
        if (checkUser) {
            if (checkUser.email === email) {
                return handleResponse(res, 400, errors.email_exist); // Email already taken
            }
            if (checkUser.username === username) {
                return handleResponse(res, 400, errors.username_exist); // Username already taken
            }
        }
        let OTP = generateOTP();
        await sendOTPEmailVerification(OTP, email, name)
        await redis.set(`OTP:${email}`, JSON.stringify({ OTP }), "EX", config.REDIS_EXPIRE_IN);  // when in resend otp we often dont have to search back again and again and cache could do the thing.
        return handleResponse(res, 200, success.otp_sent);
    } catch (err: any) {
        console.log(err)
        return handleResponse(res, 500, errors.catch_error);
    }
};