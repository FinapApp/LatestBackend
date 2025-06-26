import { Request, Response } from "express";
import { validateOTPForgetPassword } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
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
    try {
        const validationError: Joi.ValidationError | undefined = validateOTPForgetPassword(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { email, username, phone, otp } = req.body as VerifyOTPForgetPasswordRequest;
        const identifier = email || username || phone;

        if (!identifier) {
            return handleResponse(res, 400, errors.identifier_not_found);
        }

        const redisDataRaw = await redis.get(`FORGET-PASSWORD:${identifier}`);
        if (!redisDataRaw) {
            return handleResponse(res, 400, errors.otp_expired);
        }

        let parsedData: { OTP: string; _id: string };
        try {
            parsedData = JSON.parse(redisDataRaw);
        } catch {
            return handleResponse(res, 400, errors.otp_expired);
        }

        if (otp !== parsedData.OTP) {
            return handleResponse(res, 404, errors.otp_not_match);
        }

        return handleResponse(res, 200, success.verify_otp);
    } catch (err: any) {
        await sendErrorToDiscord("POST:verify-otp-forget-password", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
