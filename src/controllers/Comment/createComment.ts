import { Request, Response } from "express"
import { COMMENT } from "../../models/Comment/comment.model"
import { validateComment } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { sendErrorToDiscord } from "../../config/discord/errorDiscord"

export const createComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateComment(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const createComment = await COMMENT.create({
            user: res.locals.userId,
            flick: req.params.flickId,
            comment: req.body.comment
        })
        if (createComment) {
            //send things to kafka
            return handleResponse(res, 201, success.create_comment)
        }
        return handleResponse(res, 304, errors.create_comment)
    } catch (error) {
        sendErrorToDiscord("create-comment", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}