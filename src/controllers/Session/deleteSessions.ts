import { Request, Response } from "express"
import Joi from "joi";
import { validateSessionId } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { SESSION } from "../../models/User/userSession.model";

export const deleteSessions = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateSessionId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteSessions = await SESSION.deleteMany({ userId: req.params.userId })
        if (deleteSessions) {
            return handleResponse(res, 200, success.session_deleted)
        }
        return handleResponse(res, 404, errors.session_deleted)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
