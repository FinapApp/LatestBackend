import { Response, Request } from "express";
import { validateUpdateTheme } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { USERPREFERENCE } from "../../../models/User/userPreference.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";


export const updateTheme = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateTheme(
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
        const updateTheme = await USERPREFERENCE.findByIdAndUpdate(
            res.locals.userId,
            req.body,
            { new: true, upsert: true  }
        );
        if (updateTheme) {
            return handleResponse(res, 200, success.update_theme);
        }
        return handleResponse(res, 304, errors.update_theme);
    } catch (err: any) {
        sendErrorToDiscord("PUT:theme", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
