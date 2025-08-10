import { Response, Request } from "express";
import { validateUpdateComment } from "../../validators/validators";
import { handleResponse, errors, success,  Lang } from "../../utils/responseCodec";
import Joi from "joi";
import { COMMENT } from "../../models/Comment/comment.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const updateComment = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateComment(
            req.body, req.params , req.query
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                lang,
                validationError.details
            );
        }
        const updateComment = await COMMENT.findOneAndUpdate(
            { _id: req.params.commentId, user: res.locals.userId },
            req.body,
            { new: true }
        );
        if (updateComment) {
            return handleResponse(res, 200, success.update_comment , lang);
        }
        return handleResponse(res, 304, errors.update_comment   , lang);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-comment", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
