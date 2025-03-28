import { Request, Response } from "express";
import { validateOTPAfterForgetPassword } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import { USER } from "../../models/User/user.model";


interface VerifyOTPForgetPasswordRequest {
    otp: string;
    password: string;
    email?: string;
    username?: string;
    phone?: string;
}

export const verifyOTPForgetPassword = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined =
            validateOTPAfterForgetPassword(req.body);
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const { email, username, phone, otp, password } = req.body as VerifyOTPForgetPasswordRequest;
        // VERIFY OTP FROM THE REDIS

        const identifier = email || username || phone;
        const getOTP = await redis.get(`FORGET-PASSWORD:${identifier}`);
        if(getOTP){
            const filteredOTP  = JSON.parse(getOTP as string)
            if (otp !== filteredOTP.generatedOTP) {
                return handleResponse(res, 404, errors.otp_not_match)
            }
            const updatePassword = await USER.findByIdAndUpdate(filteredOTP._id, { password }, { new: true })
            if (!updatePassword) {
                return handleResponse(res, 400, errors.password_not_updated);
            }
            await redis.del(`FORGET-PASSWORD:${identifier}`);
            return handleResponse(res, 200, success.password_updated);
        }
            return handleResponse(res, 400, errors.otp_expired);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error);
    }
};
