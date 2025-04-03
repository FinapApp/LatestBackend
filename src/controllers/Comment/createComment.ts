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
        const flick = req.params.flickId
        const comment = req.body.comment;
        let updateStatement: { user: string, flick?: string, comment?: string } = { user };
        if (flick) updateStatement.flick = flick;
        if (comment) updateStatement.comment = comment;
        // Create Comment in MongoDB
        const createComment = await COMMENT.create(updateStatement);

        if (!createComment) {
            return handleResponse(res, 304, errors.create_comment);
        }

        // Redis Key for Comments
        const redisKey = `flick:comments:${flick}`;
        const hasRedis = await redis.exists(redisKey);

        if (!hasRedis) {
            const flickDoc = await FLICKS.findById(flick).select("commentCount");
            console.log(flickDoc, "flickDoc")
            if (flickDoc) {
                await redis.hset(redisKey, "count", flickDoc.commentCount || 0);
            }
        }
        // Increment Redis Counter
        await redis.hincrby(redisKey, "count", 1);
        await redis.hset(`${redisKey}:users`, user, 1);
        // TODO: Send Kafka Event
        // await producer.send({
        //     topic: "comment-events",
        //     messages: [
        //         {
        //             key: flick,
        //             value: JSON.stringify({
        //                 flickId: flick,
        //                 userId: user,
        //                 action: "comment",
        //                 timestamp: Date.now(),
        //             }),
        //         },
        //     ],
        // });

        return handleResponse(res, 201, success.create_comment);
    } catch (error) {
        sendErrorToDiscord("POST:create-comment", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
