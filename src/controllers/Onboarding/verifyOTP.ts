import { Request, Response } from "express";
import { validateAfterSignUp, validateVerifyOTPSignUp } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import jwt from "jsonwebtoken"
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";
import { USERFCM } from "../../models/User/userFCM.model";


interface ForgetOTPRequest {
    email: string;
    otp: string;
    fcmToken: string;
    name: string;
    password: string;
    phone: string;
    dob: string
    country: string
    username: string
}

export const verifyOTPAfterSignUp = async (req: Request, res: Response) => {
    console.log(req.body)
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
        if (otp !== OTP) {
            return handleResponse(res, 404, errors.otp_not_match)
        }
        const userCreate = await USER.create({ email ,...rest})
        const accessToken = jwt.sign(
            { userId: userCreate._id },
            config.JWT.ACCESS_TOKEN_SECRET as string,
            { expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE_IN }
        );
        const refreshToken = jwt.sign({
            userId: userCreate._id
        },
            config.JWT.REFRESH_TOKEN_SECRET as string
        )
        return handleResponse(res, 200, { accessToken, refreshToken });
    } catch (err: any) {
        console.log(err)
        if(err.code === 11000){
            return handleResponse(res, 400, errors.retry_signup);
        }
        return handleResponse(res, 500, errors.catch_error);
    }
};
