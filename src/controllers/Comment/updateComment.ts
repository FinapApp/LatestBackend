import { Response, Request } from "express";
import { validateUpdateComment } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { COMMENT } from "../../models/Comment/comment.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const updateComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateComment(
            req.body, req.params
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const updateComment = await COMMENT.findByIdAndUpdate(
            req.params.commentId,
            req.body
        );
        if (updateComment) {
            return handleResponse(res, 200, success.update_comment);
        }
        return handleResponse(res, 304, errors.update_comment);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-comment", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
