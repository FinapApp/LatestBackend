import { Request, Response } from "express";
import { COMMENT } from "../../models/Comment/comment.model";
import { validateComment } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
// import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { redis } from "../../config/redis/redis.config";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import mongoose from "mongoose";
import { FOLLOW } from "../../models/User/userFollower.model";
// import { sendNotificationKafka } from "../../config/kafka/kafka.config";
export const createComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateComment(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId;
        const flick = req.params.flickId;
        const comment = req.body.comment;
        // 1. Create Comment in MongoDB
        const flickExists = await FLICKS.findById(flick, "user commentSetting audienceSetting thumbnailURL commentCount");
        if (!flickExists) {
            return handleResponse(res, 404, errors.flick_not_found);
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
                return handleResponse(res, 403, errors.permission_denied);
            }
        } else if (flickExists.commentSetting !== 'everyone' && !isOwner) {
            return handleResponse(res, 403, errors.permission_denied);
        }
        const newComment = await COMMENT.create({
            user,
            flick,
            comment
        });
        if (!newComment) {
            return handleResponse(res, 304, errors.create_comment);
        }
        const updatedFlick = await FLICKS.findByIdAndUpdate(
            flick,
            { $inc: { commentCount: 1 } },
            {
                new: true,
                // populate: {
                //     path: "user",
                //     select: "photo username name"
                // },
                //  projection: {
                //     commentCount: 1,
                //     user,
                //     thumbnailURL: 1,
                //     audienceSetting: 1,
                //     commentSetting: 1
                // }
            }
        );
        if (!updatedFlick) {
            await COMMENT.deleteOne({ _id: newComment._id });
            return handleResponse(res, 404, errors.flick_not_found);
        }
        // 3. Redis Operations
        const redisKey = `flick:comments:${flick}`;
        // Check if Redis key exists using pipeline for atomic operation
        const [exists] = await redis.pipeline()
            .exists(redisKey)
            .hincrby(redisKey, "count", 1)
            .hset(`${redisKey}:users`, user._id, 1)
            .exec();
        // If Redis key didn't exist, set initial value from MongoDB
        if (exists === 0) {
            await redis.hset(redisKey, "count", updatedFlick.commentCount);
        }
        // sendNotificationKafka('create-comment', {
        //     flickId: updatedFlick.thumbnailURL,
        //     user: user,
        //   comment: comment,
        // })
        return handleResponse(res, 201, success.create_comment);
    } catch (error) {
        sendErrorToDiscord("POST:create-comment", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};