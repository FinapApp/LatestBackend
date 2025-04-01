import { Request, Response } from "express";
import { errors, handleResponse,  } from "../../utils/responseCodec";
import Joi from "joi";
import { validateCreateStory } from "../../validators/validators";

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateStory(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
       
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};