import { Request, Response } from "express"
import { COMMENT } from "../../../models/Comment/comment.model"
import Joi from "joi";
import { validateCommentId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";

export const deleteComment = async (req: Request, res: Response)  => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCommentId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteComment = await COMMENT.findByIdAndDelete(req.params.commentId)
        if (deleteComment) {
            // deleteThoseComment as well that as the same commentId as parentComment in the comment model
            return handleResponse(res, 200, success.comment_deleted)
        }
        return handleResponse(res, 404, errors.comment_delete)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
