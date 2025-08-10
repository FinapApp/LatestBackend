import { Request, Response } from "express";
import { COMMENT, ITextDataSchema } from "../../models/Comment/comment.model";
import { validateComment } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
// import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import mongoose from "mongoose";
import { FOLLOW } from "../../models/User/userFollower.model";
import { sendBulkNotificationKafka } from "../../utils/sendNotificationKafka";
// import { sendNotificationKafka } from "../../config/kafka/kafka.config";
export const createComment = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateComment(req.body, req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }
        const user = res.locals.userId;
        const flick = req.params.flickId;
        const comment = req.body.comment;
        // 1. Create Comment in MongoDB
        const flickExists = await FLICKS.findById(flick, "user commentSetting audienceSetting thumbnailURL commentCount");
        if (!flickExists) {
            return handleResponse(res, 404, errors.flick_not_found, lang);
        }
        let flickUser = flickExists.user
        const isOwner = flickUser == user
        if (flickExists.commentSetting === 'friends' && !isOwner) {
            // Check if current user follows flick creator
            const isFollowing = await FOLLOW.findOne({
                follower: new mongoose.Types.ObjectId(user),
                following: flickUser
            });

            if (!isFollowing) {
                return handleResponse(res, 403, errors.permission_denied, lang);
            }
        } else if (flickExists.commentSetting !== 'everyone' && !isOwner) {
            return handleResponse(res, 403, errors.permission_denied, lang);
        }
        const newComment = await COMMENT.create({
            user,
            flick,
            comment
        });
        if (!newComment) {
            return handleResponse(res, 304, errors.create_comment , lang);
        }
        const updatedFlick = await FLICKS.findByIdAndUpdate(
            flick,
            { $inc: { commentCount: 1 } },
            {
                new: true,
            }
        );
        if (!updatedFlick) {
            await COMMENT.deleteOne({ _id: newComment._id });
            return handleResponse(res, 404, errors.flick_not_found , lang);
        }
        const commentSnippet = comment
            .map((seg: ITextDataSchema) => seg.text || '')
            .join(' ')
            .slice(0, 100);
        let kafkaMessages = [];
        if (user !== updatedFlick.user.toString()) {
            kafkaMessages.push({
                key: `NEW_COMMENT`,
                value: {
                    userId: user,
                    contentUserId: updatedFlick.user.toString(),
                    metadata: {
                        commentSnippet,
                        thumbnailURL: updatedFlick.thumbnailURL,
                    commentCount: updatedFlick.commentCount,
                },
                timestamp: new Date().toISOString(),
            }
            });
        }
        const mentionedUserIdsSet = new Set<string>();
        comment.forEach((segment: ITextDataSchema) => {
            if (segment.mention) {
                const mentionedIdStr = segment.mention.toString();
                if (mentionedIdStr !== user) {  // avoid notifying self if replier mentioned themselves
                    mentionedUserIdsSet.add(mentionedIdStr);
                }
            }
        });
        const mentionedUserIds = Array.from(mentionedUserIdsSet);
        if (mentionedUserIds.length > 0) {
            kafkaMessages.push({
                key: `MENTIONED_COMMENT`,
                value: {
                    userId: user,
                    contentUserId: mentionedUserIds,   // send to all mentioned users
                    metadata: {
                        commentSnippet,
                        thumbnailURL: updatedFlick.thumbnailURL,
                        commentCount: updatedFlick.commentCount,
                    },
                    timestamp: new Date().toISOString(),
                }
            });
        }
        // Send Kafka notifications for new comment
        await sendBulkNotificationKafka(kafkaMessages);
        return handleResponse(res, 201, success.create_comment , lang, );
    } catch (error) {
        sendErrorToDiscord("POST:create-comment", error);
        return handleResponse(res, 500, errors.catch_error , lang);
    }
};