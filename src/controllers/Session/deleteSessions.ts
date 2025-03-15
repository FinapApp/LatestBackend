import { Request, Response } from "express"
import Joi from "joi";
import { validateRefreshToken, validateSessionId } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { STORY } from "../../models/Stories/story.model";
import { SESSION } from "../../models/User/userSession.model";
import { Types } from "mongoose";

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateRefreshToken(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { refreshToken } = req.body as { refreshToken: string }
        const currentRefreshTokenSession = await SESSION.findOne({
            refreshToken
        }, "_id");
        if (currentRefreshTokenSession){
            const deleteSessions = await SESSION.deleteMany({
                user: res.locals.userId,
                _id: { $ne: currentRefreshTokenSession._id }
            });
            if (deleteSessions) {
                // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
                return handleResponse(res, 200, success.session_deleted)
            }
            return handleResponse(res, 404, errors.session_deleted)
        } 
        return handleResponse(res, 404 , errors.session_not_found)
       
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
