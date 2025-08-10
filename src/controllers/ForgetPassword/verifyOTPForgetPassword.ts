import { Request, Response } from "express";
import { validateOTPForgetPassword } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success, Lang } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export interface VerifyOTPForgetPasswordRequest {
    otp: string;
    password: string;
    email?: string;
    username?: string;
    phone?: string;
}

export const verifyOTPForgetPassword = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateOTPForgetPassword(req.body as VerifyOTPForgetPasswordRequest, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }

        const { email, username, phone, otp } = req.body as VerifyOTPForgetPasswordRequest;
        const identifier = email || username || phone;

        if (!identifier) {
            return handleResponse(res, 400, errors.identifier_not_found, lang);
        }

        // JSON.stringify({ generatedOTP, _id: checkUser._id }),
        const redisDataRaw = await redis.get(`FORGET-PASSWORD:${identifier}`);
        if (!redisDataRaw) {
            return handleResponse(res, 400, errors.otp_expired, lang);
        }

        let parsedData: { OTP: string };
        try {
            parsedData = JSON.parse(redisDataRaw);
        } catch {
            return handleResponse(res, 400, errors.otp_expired, lang);
        }

        if (otp !== parsedData.OTP) {
            return handleResponse(res, 404, errors.otp_not_match, lang);
        }
        return handleResponse(res, 200, success.verify_otp, lang);
    } catch (err: any) {
        await sendErrorToDiscord("POST:verify-otp-forget-password", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
