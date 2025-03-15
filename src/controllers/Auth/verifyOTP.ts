import { Request, Response } from "express";
import {  validateForgetPassword } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import jwt from "jsonwebtoken"
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";

export const verifyOTP = async (req: Request, res: Response) => {
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
        const { email, otp } = req.body as { email: string; otp: string };
        // VERIFY OTP FROM THE REDIS
        const getOTP = await redis.get(`EMAIL:${email}`);
        if (!getOTP) {
            return handleResponse(res, 400, errors.otp_expired);
        }
        if (otp !== getOTP) {
            return handleResponse(res, 404, errors.otp_not_match)
        }
        const checkCustomer = await USER.findOne({ email }, "_id")
        // REMOVE OTP FROM THE REDIS
        await redis.del(`EMAIL:${email}`);
        if (!checkCustomer) {
            return handleResponse(res, 400, errors.email_not_found);
        }
        const token = jwt.sign(
            {
                customerId: checkCustomer._id
            },
            config.JWT.ACCESS_TOKEN_SECRET,
            { expiresIn: '4d' }
        );
        res.cookie('x-access-token', token, {
            expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV! === 'production',
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        });
        return handleResponse(res, 200, success.verify_otp);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error);
    }
};
