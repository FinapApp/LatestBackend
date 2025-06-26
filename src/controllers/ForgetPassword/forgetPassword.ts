import { Request, Response } from "express";
import { validateForgetPassword } from "../../validators/validators";
import { redis } from "../../config/redis/redis.config";
import Joi from "joi";
import { config } from "../../config/generalconfig";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { generateNumericOTP } from "../../utils/OTPGenerator";
import { USER } from "../../models/User/user.model";
import { sendForgotPasswordEmail } from "../../utils/sendOTP_ForgetPassword";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { sendForgotPasswordPhone } from "../../utils/sendForgotPasswordPhone";
interface ForgetPasswordRequest {
    email?: string;
    username?: string;
    phone?: string;
}
export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateForgetPassword(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { email, username, phone } = req.body as ForgetPasswordRequest;
        
        const checkUser = await USER.findOne({
            ...(email && { email }),
            ...(username && { username }),
            ...(phone && { phone })
        } , "email username phone");

        if (!checkUser) {
            return handleResponse(res, 404, errors.user_not_found);
        }
        const generatedOTP = generateNumericOTP();
        if (checkUser.email) {
            await sendForgotPasswordEmail(
                generatedOTP,
                checkUser.email as string,
                checkUser.username as string,
            );
        }
        if (checkUser.phone) {
            await sendForgotPasswordPhone(
                generatedOTP,
                checkUser.phone as string,
            );
        }
        // Store OTP in Redis as JSON string
        await redis.set(
            `FORGET-PASSWORD:${email || username || phone}`,
            JSON.stringify({ OTP: generatedOTP, _id: checkUser._id }),
            "EX",
            config.REDIS_EXPIRE_IN
        );
        return handleResponse(res, 200, success.forget_password);
    } catch (err: any) {
        console.log(err)
        sendErrorToDiscord("POST:forget-password", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
