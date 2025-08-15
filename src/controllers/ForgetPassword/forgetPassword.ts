import { Request, Response } from "express";
import { validateForgetPassword } from "../../validators/validators";
import { redis } from "../../config/redis/redis.config";
import Joi from "joi";
import { config } from "../../config/generalconfig";
import { handleResponse, errors, Lang} from "../../utils/responseCodec";
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

const changeLanguage = (lang: Lang ,email: string ,phone: string): string => {
    switch (lang) {
        case 'en':
            return email
            ? `An OTP has been sent to your email ${email}.`
            : `An OTP has been sent to your phone ${phone}.`;
        case 'hi':
            return email
            ? `एक ओटीपी आपके ईमेल ${email} पर भेजा गया है।`
            : `एक ओटीपी आपके फ़ोन नंबर ${phone} पर भेजा गया है।`;
        case 'ru':
            return email
            ? `На ваш адрес электронной почты ${email} отправлен OTP.`
            : `OTP отправлен на ваш номер телефона ${phone}.`;
        case 'uz':
            return email
            ? `OTP sizning elektron pochtangizga (${email}) yuborildi.`
            : `OTP sizning telefon raqamingizga (${phone}) yuborildi.`;
        default:
            return email
            ? `An OTP has been sent to your email ${email}.`
            : `An OTP has been sent to your phone ${phone}.`;
    }
};

export const forgetPassword = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateForgetPassword(req.body as ForgetPasswordRequest, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const { email, username, phone } = req.body as ForgetPasswordRequest;
        
        const checkUser = await USER.findOne({
            ...(email && { email }),
            ...(username && { username }),
            ...(phone && { phone })
        } , "email username phone");

        if (!checkUser) {
            return handleResponse(res, 404, errors.user_not_found, lang);
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
            return handleResponse(res, 200 , changeLanguage(lang, checkUser.email as string, ""));
        }
        if (checkUser.phone) {
            await sendForgotPasswordPhone(
                generatedOTP,
                checkUser.phone as string,
            );
        }
        return handleResponse(res, 200, changeLanguage(lang, "", checkUser.phone as string));
    } catch (err: any) {
        console.log(err);
        sendErrorToDiscord("POST:forget-password", err);
        return handleResponse(res, 500, errors.catch_error , lang);
    }
};
