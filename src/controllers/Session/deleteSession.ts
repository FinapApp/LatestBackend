import { Request, Response } from "express"
import Joi from "joi";
import { validateSessionId} from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { SESSION } from "../../models/User/userSession.model";

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateSessionId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteSession  = await SESSION.findByIdAndDelete(req.params.sessionId)
        if (deleteSession) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.session_deleted)
        }
        return handleResponse(res, 404, errors.session_deleted)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
