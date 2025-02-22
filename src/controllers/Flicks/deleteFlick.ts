import { Request, Response } from "express"
import Joi from "joi";
import { validateFlickId } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FLICKS } from "../../models/Flicks/flicks.model";

export const deleteFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFlickId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteFlick = await FLICKS.findByIdAndDelete(req.params.flickId)
        if (deleteFlick) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.flick_deleted)
        }
        return handleResponse(res, 404, errors.flick_deleted)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
