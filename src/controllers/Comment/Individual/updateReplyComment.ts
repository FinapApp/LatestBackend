import { Request, Response } from "express"
import Joi from "joi";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import { validateUpdateComment } from "../../../validators/validators";
import { COMMENT } from "../../../models/Comment/comment.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const updateReplyComment = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang  || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateComment(req.body, req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const { comment } = req.body
        const updateComment = await COMMENT.findByIdAndUpdate(req.params.commentId, {
            comment
        })
        if (updateComment) {
            // // send this to the kafka
            // const userIds = comment.filter((e: { mention: string }) => e.mention).map((e: { mention: string }) => e.mention)
            // await sendMessage('notification-services', `comment`, userIds);
            return handleResponse(res, 200, success.update_comment , lang);
        }
        return handleResponse(res, 304, errors.update_comment , lang);
    } catch (error) {
        sendErrorToDiscord("PUT:update-reply-comment", error)
        return handleResponse(res, 500, errors.catch_error , lang);
    }
}
