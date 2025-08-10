import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateUsername } from "../../validators/validators";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";


export const checkUserNameExist = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUsername(req.body , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const checkUserExist = await USER.findOne({username : req.body.username})
        if(checkUserExist){
            return handleResponse(res, 404  , errors.username_exist, lang)
        }
        return handleResponse(res, 200, success.username_available, lang);
    } catch (error: any) {
        sendErrorToDiscord("POST:username-exist", error)
        if (error.code == 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt, lang)
        }
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};