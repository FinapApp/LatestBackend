import { Request, Response } from "express";
import Joi from "joi";
import { validateDeleteFlick } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { USER } from "../../models/User/user.model";
import { COMMENT } from "../../models/Comment/comment.model";
import { LIKE } from "../../models/Likes/likes.model";

export const deleteFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateDeleteFlick(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const userId = res.locals.userId;
        const flickId = req.params.flickId;
        const {reposted}= req.query;

        // Atomic check-and-delete operation
        const deletedFlick = await FLICKS.findOneAndDelete({ _id: flickId, user: userId , repost: reposted === "true" ? { $exists: true } : { $exists: false } });
        if (!deletedFlick) {
            return handleResponse(res, 404, errors.flick_not_found);
        }
        await Promise.all([
            getIndex("FLICKS").deleteDocument(flickId),
            USER.findByIdAndUpdate(userId, {
                $inc: {
                    [reposted === "true" ? "repostCount" : "flickCount"]: -1
                }
            }),
            COMMENT.deleteMany({ flick: flickId }),
            LIKE.deleteMany({ flick: flickId })
        ]);

        return handleResponse(res, 200, success.flick_deleted);
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-flick", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};