import { Request, Response } from 'express'
import { COMMENT } from '../../models/Comment/comment.model'
import { validateCommentId } from '../../validators/validators'
import { errors, handleResponse } from '../../utils/responseCodec'
import Joi from 'joi'
import { sendErrorToDiscord } from '../../config/discord/errorDiscord'

export const getComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCommentId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { commentId } = req.params
        const CHILDCOMMENT = await COMMENT.find({ parentComment: commentId }).populate('user', 'username photo name')
        return handleResponse(res, 200, { CHILDCOMMENT })
    } catch (error) {
        sendErrorToDiscord("GET:get-comment", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}