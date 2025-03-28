import { Response, Request } from "express";
import { validateUpdateTwoFactor } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { USERPREFERENCE } from "../../../models/User/userPreference.model";


export const updateTwoFactorAuth = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateTwoFactor(
            req.body
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const updateReel = await USERPREFERENCE.findByIdAndUpdate(
            res.locals.userId,
            req.body,
        );
        if (updateReel) {
            return handleResponse(res, 200, success.update_two_factor);
        }
        return handleResponse(res, 304, errors.update_two_factor);
    } catch (err: any) {

        return handleResponse(res, 500, errors.catch_error);
    }
};
