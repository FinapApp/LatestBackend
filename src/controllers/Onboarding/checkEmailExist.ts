import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateEmail } from "../../validators/validators";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";


export const checkEmailExist = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateEmail(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const checkUserExist = await USER.findOne({ email: req.body.email })
        if (checkUserExist) {
            return handleResponse(res, 409, errors.email_exist)
        }
        return handleResponse(res, 200, success.email_available);
    } catch (error: any) {
        sendErrorToDiscord("POST:email-exist", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};