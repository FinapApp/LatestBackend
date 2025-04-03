import { Request, Response } from "express";
import { validateLikeToggle } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
// import { LIKE, } from "../../models/Likes/likes.model";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { redis } from "../../config/redis/redis.config";

interface QueryParams {
    id: string;
    type: 'quest' | 'comment' | 'flick';
}
import { LIKE } from "../../models/Likes/likes.model";


const buildLikeQuery = (user: string, id: string, type: 'quest' | 'comment' | 'flick') => {
    const query: any = { user };
    if (type === 'flick') query.flick = id;
    if (type === 'comment') query.comment = id;
    if (type === 'quest') query.quest = id;
    return query;
};

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateLikeToggle(req.body, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const user = res.locals.userId;
        const { value } = req.body; // boolean
        const { id, type }: QueryParams = req.query as any;

        const query = buildLikeQuery(user, id, type);
        const existingLike = await LIKE.findOne(query);

        const redisKey = `${type}:likes:${id}`;
        const redisUserKey = `${redisKey}:users`;

        // Ensure Redis is initialized with DB likeCount
        if (!(await redis.exists(redisKey)) && type === 'flick') {
            const flickDoc = await FLICKS.findById(id).select("likeCount");
            if (flickDoc) {
                await redis.hset(redisKey, "count", flickDoc.likeCount || 0);
            }
        }

        let countDelta = 0;

        if (existingLike) {
            if (existingLike.value !== value) {
                existingLike.value = value;
                await existingLike.save();
                countDelta = value ? 1 : -1;
            } else {
                // If trying to re-toggle the same value, treat as delete
                await existingLike.deleteOne();
                countDelta = value ? -1 : 0;
            }
        } else {
            // Create new like
            await LIKE.create({ ...query, value });
            countDelta = value ? 1 : 0;
        }

        if (countDelta !== 0) {
            await redis.hincrby(redisKey, "count", countDelta);
        }
        await redis.hset(redisUserKey, user, value ? 1 : 0);

        return handleResponse(res, 200, success.toggle_like);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
