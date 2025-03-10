import { Request, Response } from "express";
import { validateForgetPassword } from "../../validators/validators";
import { redis } from "../../config/redis/redis.config";
import Joi from "joi";
import { config } from "../../config/generalconfig";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { generateOTP } from "../../utils/OTPGenerator";
import { ADMIN } from "../../models/Admin/admin.model";
import { USER } from "../../models/User/user.model";
import { sendOTPNewPassword } from "../../utils/sendOTP_ForgetPassword";


interface ForgetPasswordRequest {
    identifier: string;
}

export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined =
            validateForgetPassword(req.body);
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const { identifier } = req.body as ForgetPasswordRequest;
        const checkUser = await USER.findOne({ $or: [{ email: identifier }, { username: identifier }, { phone: identifier }] }, "email username phone")
        if (!checkUser) return handleResponse(res, 400, errors.user_not_found);
        let generatedOTP = generateOTP();
        if (checkUser.email || checkUser.username) {
            await sendOTPNewPassword(generatedOTP, checkUser.email as string, checkUser.username as string, "Forget Password")
            redis.set(`FORGET-PASSWORD:${identifier}`, { generatedOTP, _id: checkUser._id }, "EX", config.REDIS_EXPIRE_IN);
        }
        if (checkUser.phone) {
            // SEND OTP TO THE PHONE
            // NOT YET FINALIZED
        }
        // await (generatedOTP, checkUser.email as string, checkUser.username as string, "Forget Password")
        // // SET OTP TO THE REDIS
        // await redis.set(`EMAIL:${email}`, generatedOTP, "EX", config.REDIS_EXPIRE_IN);
        // SEND OTP TO THE EMAIL
        // await sendOTP_viaEmail(generatedOTP, email, checkEmail?.name as string)
        // return handleResponse(res, 200, success.forget_password);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error);
    }
};
