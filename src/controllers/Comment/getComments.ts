import { Request, Response } from 'express'
import Joi from 'joi';
import { validateFlickId } from '../../validators/validators';
import { errors, handleResponse } from '../../utils/responseCodec';
import { COMMENT } from '../../models/Comment/comment.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getComments = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFlickId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { flickId } = req.params
        const COMMENTSLIST = await COMMENT.find({ flick: flickId }).populate('user', 'username profilePicture').sort({ createdAt: -1 });
        if(!COMMENTSLIST) {
            return handleResponse(res, 404, errors.comment_not_found)
        }
        return handleResponse(res, 200, { COMMENTSLIST })
    } catch (error) {
        sendErrorToDiscord("get-comments", error)
     return handleResponse(res, 500, errors.catch_error)
    }
}
