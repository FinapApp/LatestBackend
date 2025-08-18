import { Request, Response } from "express"
import { validateCreateReply } from "../../../validators/validators"
import Joi from "joi"
import { COMMENT, ITextDataSchema } from "../../../models/Comment/comment.model"
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec"
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord"
import { FLICKS } from "../../../models/Flicks/flicks.model";
import { Types } from "mongoose"
import { FOLLOW } from "../../../models/User/userFollower.model"
import { sendBulkNotificationKafka } from "../../../utils/sendNotificationKafka"

export const createReplyComment = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateReply(req.body, req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }

        const user = res.locals.userId;
        const { flickId: flick, commentId: parentComment } = req.params;
        const comment = req.body.comment;

        const parentCommentCheck = await COMMENT.findById(parentComment, "user flick comment").lean();
        if (!parentCommentCheck) {
            return handleResponse(res, 404, errors.comment_not_found, lang);
        }
        if (!parentCommentCheck.flick || parentCommentCheck.flick.toString() !== flick) {
            return handleResponse(res, 400, errors.comment_flick_mismatch, lang);
        }
        // Check if flick exists
        const flickExists = await FLICKS.findById(flick, "user commentSetting audienceSetting thumbnailURL commentCount");
        if (!flickExists) {
            return handleResponse(res, 404, errors.flick_not_found, lang);
        }
        let flickUser = flickExists.user;
        const isOwner = flickUser == user;
        if (flickExists.commentSetting === 'friends' && !isOwner) {
            // Check if current user follows flick creator
            const isFollowing = await FOLLOW.findOne({
                follower: new Types.ObjectId(user),
                following: flickUser
            });
            if (!isFollowing) {
                return handleResponse(res, 403, errors.permission_denied, lang);
            }
        } else if (flickExists.commentSetting !== 'everyone' && !isOwner) {
            return handleResponse(res, 403, errors.permission_denied, lang);
        }
        const createReplyComment = await COMMENT.create({
            user,
            flick,
            comment,
            parentComment,
        });
        if (!createReplyComment) {
            return handleResponse(res, 304, errors.create_comment, lang);
        }
        const updateReplyCount = await COMMENT.findByIdAndUpdate(
            parentComment,
            { $inc: { replyCount: 1 } },
            { new: true }
        ); 
        if (!updateReplyCount) {
            await COMMENT.deleteOne({ _id: createReplyComment._id });
            return handleResponse(res, 404, errors.comment_not_found, lang);
        }
        const commentSnippet = comment
            .map((seg: ITextDataSchema) => seg.text || '')
            .join(' ')
            .slice(0, 100);
        let kafkaMessages = [];
        if (user !== parentCommentCheck.user.toString()) {
            kafkaMessages.push({
                key: `NEW_COMMENT_REPLY`,
                value: {
                    userId: user,
                    recipientUserId: parentCommentCheck.user.toString(), // The one who gets the notification
                    triggeredByUserId: user, 
                    metadata: {
                        flick,
                        parentComment,
                        commentSnippet,
                    },
                    timestamp: new Date().toISOString(),
                }
            });
        }
        const mentionedUserIdsSet = new Set<string>();
        comment.forEach((segment: ITextDataSchema) => {
            if (segment.mention) {
                const mentionedIdStr = segment.mention.toString();
                if (mentionedIdStr !== user) {
                    mentionedUserIdsSet.add(mentionedIdStr);
                }
            }
        });
        const mentionedUserIds = Array.from(mentionedUserIdsSet);
        if (mentionedUserIds.length > 0) {
            kafkaMessages.push({
                key: `MENTIONED_COMMENT_REPLY`,
                value: {
                    userId: user,
                    contentUserIds: mentionedUserIds,
                    metadata: {
                        commentSnippet,
                        comment: createReplyComment._id.toString(),
                        parentComment,
                        flick,
                        thumbnailURL: flickExists.thumbnailURL,
                    },
                    timestamp: new Date().toISOString(),
                }
            });
        }
        if (kafkaMessages.length > 0) {
            await sendBulkNotificationKafka(kafkaMessages);
        }
        return handleResponse(res, 200, success.create_comment, lang);
    } catch (error) {
        sendErrorToDiscord("POST:create-reply-comment", error);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
