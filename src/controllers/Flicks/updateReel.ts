import { Response,Request } from "express";
import { validateUpdateFlick } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FLICKS } from "../../models/Flicks/flicks.model";


export const updateReel = async (req: Request, res: Response) => {
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
            req.params.flickId ,
            req.body
        );
        if (updateReel) {
            return handleResponse(res, 200, success.flick_updated);
        }
        return handleResponse(res, 304, errors.flick_updated);
    } catch (err: any) {

        return handleResponse(res, 500, errors.catch_error);
    }
};
