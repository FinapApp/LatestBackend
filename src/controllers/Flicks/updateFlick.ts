import { Response,Request } from "express";
import { validateUpdateFlick } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const updateFlick = async (req: Request, res: Response) => {
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
        const updateFlick = await FLICKS.findByIdAndUpdate(
            req.params.flickId ,
            req.body
        );
        if (updateFlick) {
            return handleResponse(res, 200, success.flick_updated);
        }
        return handleResponse(res, 304, errors.flick_updated);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-flick", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
