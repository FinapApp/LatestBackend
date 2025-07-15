import { Request, Response } from "express";
import Joi from "joi";
import { validateDeleteFlick } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { COMMENT } from "../../models/Comment/comment.model";
import { LIKE } from "../../models/Likes/likes.model";
import { USER } from "../../models/User/user.model";
import { HASHTAGS } from "../../models/User/userHashTag.model";

export const deleteFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateDeleteFlick(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const userId = res.locals.userId;
        const flickId = req.params.flickId;

        // Find and delete in one atomic operation
        const flick = await FLICKS.findByIdAndDelete(flickId);

        // Check if flick exists and belongs to the user
        if (!flick || flick.user.toString() !== userId) {
            return handleResponse(res, 404, errors.flick_not_found);
        }

        // Extract data from deleted flick
        const isRepost = !!flick.repost;
        const originalFlickId = flick.repost;
        const description = flick.description || [];

        // Prepare cleanup operations
        const operations: Promise<any>[] = [
            getIndex("FLICKS").deleteDocument(flickId),
            USER.findByIdAndUpdate(userId, { $inc: { flickCount: -1 } }, { new: true })
                .catch(err => sendErrorToDiscord("DELETE:delete-flick:flickCount", err)),
            COMMENT.deleteMany({ flick: flickId, user: userId }),
            LIKE.deleteMany({ flick: flickId, user: userId }),
        ];

        // If it's a repost, decrement the original flick's repost count
        if (isRepost && originalFlickId) {
            operations.push(
                FLICKS.findByIdAndUpdate(originalFlickId, { $inc: { repostCount: -1 } }, { new: true })
                    .catch(err => sendErrorToDiscord("DELETE:delete-flick:repostCount", err))
            );
        }

        // Handle decrementing hashtag counts if any
        const hashtagIds = description
            .map((desc: { hashtag?: string }) => desc.hashtag)
            .filter((id: string | undefined): id is string => !!id);

        if (hashtagIds.length > 0) {
            const hashTagIndex = getIndex("HASHTAG");

            operations.push(
                HASHTAGS.updateMany({ _id: { $in: hashtagIds } }, { $inc: { count: -1 } })
                    .catch(err => sendErrorToDiscord("DELETE:delete-flick:decrement-hashtag-count", err))
            );

            // Update Meilisearch with new counts
            operations.push(
                HASHTAGS.find({ _id: { $in: hashtagIds } })
                    .select("_id value count")
                    .then(updatedHashtags => {
                        return hashTagIndex.addDocuments(updatedHashtags.map(tag => ({
                            hashtagId: (tag._id as string | { toString(): string }).toString(),
                            value: tag.value,
                            count: tag.count
                        })));
                    })
                    .catch(err => sendErrorToDiscord("DELETE:delete-flick:sync-hashtags-to-meili", err))
            );
        }
        // Execute all operations
        await Promise.all(operations);
        return handleResponse(res, 200, success.flick_deleted);
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-flick", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
