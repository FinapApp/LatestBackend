import { Response, Request } from "express";
import { validateUpdateTwoFactor } from "../../../validators/validators";
import { handleResponse, errors, success, Lang } from "../../../utils/responseCodec";
import Joi from "joi";
import { USERPREFERENCE } from "../../../models/User/userPreference.model";
import { USER } from "../../../models/User/user.model";


export const updateTwoFactorAuth = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateTwoFactor(
            req.body , req.query
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                lang,
                validationError.details
            );
        }
        const { twoFactor, twoFactorMethod } = req.body;
        const user = await USER.findById(res.locals.userId, "email phone");
        if (!user) {
            return handleResponse(res, 404, errors.user_not_found, lang);
        }
        // If enabling twoFactor, validate that required contact info exists
        if (twoFactor === true) {
            if (twoFactorMethod === "sms" && !user.phone) {
                return handleResponse(res, 400, errors.phone_not_found, lang);
            }
            if (twoFactorMethod === "email" && !user.email) {
                return handleResponse(res, 400, errors.email_not_found, lang);
            }
        }
        const updateTwoFactor = await USERPREFERENCE.findByIdAndUpdate(
            res.locals.userId,
            req.body,
            { new: true, upsert: true }
        );
        if (updateTwoFactor) {
            return handleResponse(res, 200, success.update_two_factor, lang);
        }
        return handleResponse(res, 400, errors.update_two_factor, lang);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
