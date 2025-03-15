import { Response } from "express";
import { validateUpdateFlick } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest.types";
import { redis } from "../../config/redis/redis.config";
import { FLICKS } from "../../models/Flicks/flicks.model";


export const updateReel = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateFlick(
            req.body, req.params
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const updateReel = await FLICKS.findByIdAndUpdate(
            res.locals.userId,
            req.body
        );
        if (updateReel) {
           
        }
    } catch (err: any) {

        return handleResponse(res, 500, errors.catch_error);
    }
};
