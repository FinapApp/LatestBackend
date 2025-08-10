import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import Joi from "joi";
import {  validatePhoneNumber } from "../../validators/validators";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";


export const checkPhoneExist = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validatePhoneNumber(req.body , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const { phone } = req.body;
        const checkPhoneExist = await USER.findOne({ phone })
        if (checkPhoneExist) {
            return handleResponse(res, 409, errors.phone_exist, lang);
        }
        return handleResponse(res, 200, success.phone_available, lang);
    } catch (error: any) {
        sendErrorToDiscord("POST:phone-exist", error)
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};