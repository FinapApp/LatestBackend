import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateUsername } from "../../validators/validators";
import { USER } from "../../models/User/user.model";


export const checkUserNameExist = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUsername(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const checkUserExist = await USER.findOne({username : req.body.username})
        if(checkUserExist){
            return handleResponse(res, 409, errors.username_exist)
        }
        return handleResponse(res, 200, success.username_available);
    } catch (error: any) {
        if (error.code == 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt)
        }
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};