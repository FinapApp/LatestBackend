import { Request, Response } from "express"
import Joi from "joi";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { validateUpdateComment } from "../../../validators/validators";
import { COMMENT } from "../../../models/Comment/comment.model";

export const updateReplyComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateComment(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { comment } = req.body
        const updateComment = await COMMENT.findByIdAndUpdate(req.params.commentId, {
            comment
        })
        if (updateComment) {
            // // send this to the kafka
            // const userIds = comment.filter((e: { mention: string }) => e.mention).map((e: { mention: string }) => e.mention)
            // await sendMessage('notification-services', `comment`, userIds);
            return handleResponse(res, 200, success.update_comment)
        }
        return handleResponse(res, 304, errors.update_comment)
    } catch (error) {
        return handleResponse
    }
}
