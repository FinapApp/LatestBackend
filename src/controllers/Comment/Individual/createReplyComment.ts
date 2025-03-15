import { Request, Response } from "express"
import { validateComment } from "../../../validators/validators"
import Joi from "joi"
import { COMMENT } from "../../../models/Comment/comment.model"
import { errors, handleResponse, success } from "../../../utils/responseCodec"

export const createReplyComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateComment(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const createReplyComment = await COMMENT.create({
            user: res.locals.userId,
            flick: req.params.flickId,
            comment: req.body.comment,
            parentComment : req.params.commentId
        })
        if (createReplyComment) {
            //send things to kafka
            return handleResponse(res, 200, success.create_comment)
        }
        return handleResponse(res, 304, errors.create_comment)
    } catch (error) {
        console.log(error)
       return handleResponse(res, 500, errors.catch_error)
    }
}