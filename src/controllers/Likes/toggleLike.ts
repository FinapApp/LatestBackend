import { Request, Response } from "express";
import { validateLike } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { LIKE, } from "../../models/Likes/likes.model";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { redis } from "../../config/redis/redis.config";
export const toggleLike = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateLike(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId;
        const flickId = req.body.flick;
        const { id, type }: { id: string, type: 'quest' | 'comment' | 'flick' } = req.query as { id: string, type: 'quest' | 'comment' | 'flick' };
        let query: { value: boolean, quest?: string, flick?: string, comment?: string } = { value: true };
        if (type == 'flick') query.flick = id;
        if (type == 'comment') query.comment = id;
        if (type == 'quest') query.quest = id;
        const like = await LIKE.findOneAndUpdate(
            query,
            [{ $set: { value: { $eq: [false, "$value"] } } }],
            { new: true, upsert: true, select: "_id value" }
        );
        if (!like) {
            return handleResponse(res, 500, errors.toggle_like);
        }
        const redisKey = `flick:likes:${flickId}`;
        const hasRedis = await redis.exists(redisKey);
        if (!hasRedis) {
            const flickDoc = await FLICKS.findById(flickId).select("likeCount");
            if (flickDoc) {
                await redis.hset(redisKey, "count", flickDoc.likeCount || 0);
            }
        }
        const countDelta = like.value ? 1 : -1;
        await redis.hincrby(redisKey, "count", countDelta);
        await redis.hset(`${redisKey}:users`, user, like.value ? 1 : 0);
        // await producer.send({
        //     topic: "like-events",
        //     messages: [
        //         {
        //             key: flickId,
        //             value: JSON.stringify({
        //                 flickId,
        //                 userId: user,
        //                 action: like.value ? "like" : "unlike",
        //                 timestamp: Date.now(),
        //                 countDelta
        //             }),
        //         },
        //     ],
        // });
        return handleResponse(res, 200, success.toggle_like);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
