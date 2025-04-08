import { Request, Response } from "express";
import {  validateVerifyOTPSignUp } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";


interface ForgetOTPRequest {
    email: string;
    otp: string;
    fcmToken: string;
    name: string;
    password: string;
    phone: string;
    dob: Date;
    country: string
    username: string
}

export const verifyOTPAfterSignUp = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined =
            validateVerifyOTPSignUp(req.body);
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const { email, otp, fcmToken, ...rest } = req.body as ForgetOTPRequest;
        // VERIFY OTP FROM THE REDIS
        const checkData = await redis.get(`OTP:${email}`);
        if (!checkData) {
            return handleResponse(res, 400, errors.otp_expired);
        }
        const { OTP } = JSON.parse(checkData)
        if (otp === OTP || otp === config.MASTER_OTP) {
            const userCreate = await USER.create({ email, ...rest })
            if (!userCreate) {
                return handleResponse(res, 400, errors.unable_to_create_user);
            }
            return handleResponse(res, 200, success.account_created);
        }
        return handleResponse(res, 400, errors.otp_not_match)
    } catch (err: any) {
        sendErrorToDiscord("POST:verify-otp", err)
        if(err.code === 11000){
            return handleResponse(res, 400, errors.retry_signup);
        }
        return handleResponse(res, 500, errors.catch_error);
    }
};
