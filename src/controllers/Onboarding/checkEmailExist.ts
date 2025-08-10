import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateEmail } from "../../validators/validators";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";


export const checkEmailExist = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateEmail(req.body  , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const checkUserExist = await USER.findOne({ email: req.body.email })
        if (checkUserExist) {
            return handleResponse(res, 409, errors.email_exist, lang);
        }
        return handleResponse(res, 200, success.email_available, lang);
    } catch (error: any) {
        sendErrorToDiscord("POST:email-exist", error)
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};