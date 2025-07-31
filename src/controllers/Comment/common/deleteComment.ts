import { Request, Response } from "express";
import { COMMENT } from "../../../models/Comment/comment.model";
import Joi from "joi";
import { validateCommentId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { FLICKS } from "../../../models/Flicks/flicks.model";
import mongoose from "mongoose";



export const deleteComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCommentId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const currentUserId = res.locals.userId?.toString();

        // Fetch the comment with populated flick and user fields
        const checkComment = await COMMENT.findById(req.params.commentId)
            .populate<{ flick: { _id: mongoose.Types.ObjectId, user: mongoose.Types.ObjectId, commentCount: number } }>("flick", "user commentCount")
            .populate<{ user: { _id: mongoose.Types.ObjectId } }>("user", "_id");

        if (!checkComment) {
            return handleResponse(res, 404, errors.comment_not_found);
        }

        const flickId = checkComment.flick?._id.toString();
        const flickOwnerId = checkComment.flick?.user?.toString();
        const commentOwnerId = checkComment.user?._id.toString();

        const canDelete = flickOwnerId === currentUserId || commentOwnerId === currentUserId;
        if (!canDelete) {
            return handleResponse(res, 403, errors.comment_not_authorized);
        }

        // Delete the comment
        const deletedComment = await COMMENT.findByIdAndDelete(req.params.commentId);
        if (!deletedComment) {
            return handleResponse(res, 404, errors.comment_delete);
        }

        // Decrement the comment count on the Flick
        const updatedFlick = await FLICKS.findByIdAndUpdate(
            flickId,
            { $inc: { commentCount: -1 } },
            {
                new: true,
                populate: { path: "user", select: "photo username name updatedAt" },
                projection: { commentCount: 1, user: 1, thumbnailURL: 1 }
            }
        );

        if (!updatedFlick) {
            return handleResponse(res, 404, errors.flick_not_found);
        }
        return handleResponse(res, 200, success.comment_deleted);
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-comment", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
