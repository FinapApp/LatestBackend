import { Request, Response } from "express";
import { validateVerifyOTPSignUp } from "../../validators/validators";
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
    country: string;
    username: string;
}

export const verifyOTPAfterSignUp = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined =
            validateVerifyOTPSignUp(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { email, phone, otp, fcmToken, ...rest } = req.body as ForgetOTPRequest;

        // Try to get OTP data from email-based key first, then phone-based
        const [emailData, phoneData] = await Promise.all([
            redis.get(`OTP:${email}`),
            redis.get(`OTP:${phone}`)
        ]);

        let redisData = Object.keys(emailData).length ? emailData : phoneData;
        redisData = JSON.parse(redisData);
        if (!redisData || !redisData.OTP) {
            return handleResponse(res, 400, errors.otp_expired);
        }

        const storedOTP = redisData.OTP;

        if (otp !== storedOTP && otp !== config.MASTER_OTP) {
            return handleResponse(res, 400, errors.otp_not_match);
        }

        // Create user
        const userCreate = await USER.create({ email, phone, fcmToken, ...rest }) as {
            _id: string;
            toObject: () => Record<string, any>;
        };

        if (!userCreate) {
            return handleResponse(res, 400, errors.unable_to_create_user);
        }

        // Clean up OTP data from Redis
        await Promise.all([
            redis.del(`OTP:${email}`),
            redis.del(`OTP:${phone}`)
        ]);

        // Add to Meilisearch
        const rawUser = userCreate.toObject();
        const { _id, password, ...safeUser } = rawUser;
        const userIndex = getIndex("USERS");
        await userIndex.addDocuments([
            {
                userId: _id.toString(),
                email,
                phone,
                ...safeUser,
                dob: new Date(safeUser.dob).toISOString()
            }
        ]);

        return handleResponse(res, 200, success.account_created);
    } catch (err: any) {
        console.error(err);

        if (err.code === 11000) {
            const key = err?.keyValue ? Object.keys(err.keyValue)[0] : null;
            if (key === "email") return handleResponse(res, 500, errors.email_exist);
            if (key === "username") return handleResponse(res, 500, errors.username_exist);
            if (key === "phone") return handleResponse(res, 500, errors.phone_exist)
        }
        sendErrorToDiscord("POST:verify-otp", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
