import { Request, Response } from "express"
import { validateCreateReply } from "../../../validators/validators"
import Joi from "joi"
import { COMMENT } from "../../../models/Comment/comment.model"
import { errors, handleResponse, success } from "../../../utils/responseCodec"
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord"
import { FLICKS } from "../../../models/Flicks/flicks.model";

export const createReplyComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateReply(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const user = res.locals.userId;
        const flick = req.params.flickId;

        const createReplyComment = await COMMENT.create({
            user,
            flick,
            comment: req.body.comment,
            parentComment: req.params.commentId
        });
        if (!createReplyComment) {
            return handleResponse(res, 304, errors.create_comment);
        }

        // Update flick's commentCount in MongoDB
        const updatedFlick = await FLICKS.findByIdAndUpdate(
            flick,
            { $inc: { commentCount: 1 } },
            { new: true, projection: { commentCount: 1 } }
        );
        if (!updatedFlick) {
            await COMMENT.deleteOne({ _id: createReplyComment._id });
            return handleResponse(res, 404, errors.flick_not_found);
        }
        return handleResponse(res, 200, success.create_comment);
    } catch (error) {
        sendErrorToDiscord("POST:create-reply-comment", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
