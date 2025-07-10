import { Request, Response } from "express";
import { validateForgetPassword } from "../../validators/validators";
import { redis } from "../../config/redis/redis.config";
import Joi from "joi";
import { config } from "../../config/generalconfig";
import { handleResponse, errors} from "../../utils/responseCodec";
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
        await redis.set(
            `FORGET-PASSWORD:${email || username || phone}`,
            JSON.stringify({ OTP: generatedOTP, _id: checkUser._id }),
            "EX",
            config.REDIS_EXPIRE_IN
        );
        if (checkUser.email) {
            await sendForgotPasswordEmail(
                generatedOTP,
                checkUser.email as string,
                checkUser.username as string,
            );
            return handleResponse(res, 200 , { message : `An OTP has been sent to your email. ${checkUser.email}` });
        }
        if (checkUser.phone) {
            await sendForgotPasswordPhone(
                generatedOTP,
                checkUser.phone as string,
            );
        }
        return handleResponse(res, 200, {message : `An OTP has been sent to your phone. ${checkUser.phone}`});
    } catch (err: any) {
        console.log(err)
        sendErrorToDiscord("POST:forget-password", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
