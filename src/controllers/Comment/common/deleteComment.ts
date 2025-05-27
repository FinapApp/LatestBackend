import { Request, Response } from "express"
import { COMMENT } from "../../../models/Comment/comment.model"
import Joi from "joi";
import { validateCommentId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { FLICKS } from "../../../models/Flicks/flicks.model";

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCommentId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        // Populate both flick and comment user
        const checkComment = await COMMENT.findOne({ _id: req.params.commentId })
            .populate({ path: "flick", select: "user" })
            .populate({ path: "user", select: "_id" });

            console.log(checkComment);
        if (!checkComment) {
            return handleResponse(res, 404, errors.comment_not_found);
        }
        const flickOwnerId = (checkComment.flick as any).user.toString();
        const commentOwnerId = (checkComment.user as any)?._id?.toString();
        const currentUserId = res.locals.userId.toString();

        const canDelete = flickOwnerId === currentUserId || commentOwnerId === currentUserId;

        if (!canDelete) {
            return handleResponse(res, 403, errors.comment_not_authorized);
        }

        const deleteComment = await COMMENT.findOneAndDelete({ _id: req.params.commentId});
        if (deleteComment) {
            if (deleteComment.flick) {
                await FLICKS.findByIdAndUpdate(deleteComment.flick._id, { $inc: { commentCount: -1 } }, { new: true });
            }
            // TODO: optionally delete replies (child comments) if applicable
            return handleResponse(res, 200, success.comment_deleted);
        }
        return handleResponse(res, 404, errors.comment_delete);
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-comment", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};

