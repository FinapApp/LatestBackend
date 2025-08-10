import { Request, Response } from "express";
import { handleResponse, errors, success, Lang } from "../../utils/responseCodec";
import { SESSION } from "../../models/User/userSession.model";
import { validateLogout } from "../../validators/validators";
import Joi from "joi";

export const logout = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        // Validate request body
        const validationError: Joi.ValidationError | undefined = validateLogout(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }
        const { userId, sessionId } = res.locals
        const deleteSessions = await SESSION.findOneAndDelete({ user: userId, _id: sessionId });
        if (!deleteSessions) {
            return handleResponse(res, 400, errors.session_not_found , lang);
        }
        return handleResponse(res, 200, success.logout, lang);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
