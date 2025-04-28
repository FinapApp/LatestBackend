import { Request, Response } from "express";
import { COMMENT } from "../../models/Comment/comment.model";
import { validateComment } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
// import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { redis } from "../../config/redis/redis.config";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
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
        const newComment = await COMMENT.create({
            user,
            flick,
            comment
        });

        if (!newComment) {
            return handleResponse(res, 304, errors.create_comment);
        }

        // 2. Update Flick's commentCount atomically
        const updatedFlick = await FLICKS.findByIdAndUpdate(
            flick,
            { $inc: { commentCount: 1 } },
            { new: true, projection: { commentCount: 1 } }
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
            .hset(`${redisKey}:users`, user, 1)
            .exec();

        // If Redis key didn't exist, set initial value from MongoDB
        if (exists === 0) {
            await redis.hset(redisKey, "count", updatedFlick.commentCount);
        }

        // 4. Kafka Event (Uncomment when ready)
        // await producer.send({
        //     topic: "comment-events",
        //     messages: [{
        //         key: flick,
        //         value: JSON.stringify({
        //             flickId: flick,
        //             userId: user,
        //             action: "comment",
        //             timestamp: Date.now(),
        //         }),
        //     }],
        // });

        return handleResponse(res, 201, success.create_comment);
    } catch (error) {
        sendErrorToDiscord("POST:create-comment", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};