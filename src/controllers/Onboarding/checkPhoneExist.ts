import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import {  validatePhoneNumber } from "../../validators/validators";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";


export const checkPhoneExist = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePhoneNumber(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { phone } = req.body;
        const checkPhoneExist = await USER.findOne({ phone })
        if (checkPhoneExist) {
            return handleResponse(res, 409, errors.phone_exist)
        }
        return handleResponse(res, 200, success.phone_available);
    } catch (error: any) {
        sendErrorToDiscord("POST:phone-exist", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};