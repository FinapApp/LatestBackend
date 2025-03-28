import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse} from "../../utils/responseCodec";
import { validateFlickId } from "../../validators/validators";
import { FLICKS } from "../../models/Flicks/flicks.model";

export const getFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFlickId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const flickId = req.params.flickId;
        const checkFlick = await FLICKS.findById(flickId)
        if (checkFlick) {
            return handleResponse(res , 200 , { checkFlick })
        }
        return handleResponse(res, 400, errors.no_flicks);
    } catch (error) {
        console.error(error);
     return handleResponse(res, 500, errors.catch_error);
    }
};