import { Request, Response } from "express";
import {  validateVerifyOTPSignUp } from "../../validators/validators";
import Joi from "joi";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import { config } from "../../config/generalconfig";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";


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
            const userCreate = await USER.create({ email, ...rest }) as { _id: string, toObject: () => Record<string, any> };
            if (!userCreate) {
                return handleResponse(res, 400, errors.unable_to_create_user);
            }
            // REMOVE OTP FROM REDIS // cannot create the user if otp is not removed
            await redis.del(`OTP:${email}`);
            // ADD DATA TO MEILISEARCH
            const rawUser = userCreate.toObject();
            const { _id, password, ...safeUser } = rawUser;
            const userIndex = getIndex("USERS");
            await userIndex.addDocuments([
                {
                    userId: _id.toString(), // Must match Meilisearch primary key
                    email,
                    ...safeUser,
                    dob: new Date(safeUser.dob).toISOString() // Serialize if Date
                }
            ])
            return handleResponse(res, 200, success.account_created);
        }
        return handleResponse(res, 400, errors.otp_not_match)
    } catch (err: any) {
        console.log(err)
        if (err.code === 11000) {
            const key = err?.keyValue ? Object.keys(err.keyValue)[0] : null;
            if (key === "email") {
                return handleResponse(res, 500, errors.email_exist);
            }
            if (key === "username") {
                return handleResponse(res, 500, errors.username_exist);
            }
        }
        sendErrorToDiscord("POST:verify-otp", err)
        return handleResponse(res, 500, errors.catch_error);
    }
};
