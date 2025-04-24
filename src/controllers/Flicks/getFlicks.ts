import { Request, Response } from 'express'
import { validateGetFlicks } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { FLICKS } from '../../models/Flicks/flicks.model';
import { redis } from '../../config/redis/redis.config';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getAllFlicks = async (req: Request, res: Response) => {
    try {
        //  IT IS OF THE HOME PAGE
        const validationError: Joi.ValidationError | undefined = validateGetFlicks(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        let { type, limit = 10, page } = req.query as {
            type?: string,
            limit?: number,
            page?: number
        }
        const pipeline: any[] = [];
        const skip = ((Number(page) || 1) - 1) * limit;
        switch (type) {
            case 'tagged':
                pipeline.push(
                    {
                        $match: {
                            $or: [
                                { "media.taggedUsers.user": user },
                                { "description.mention": user }
                            ]
                        }
                    }
                )
                break;
            case 'self':
                pipeline.push(
                    {
                        $match: {
                            user: user
                        }
                    }
                )
                break;
            default:
                pipeline.push(
                    {
                        $match: {}
                    }
                )
                break;
        }
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: Number(limit) });
        pipeline.push(
            // User
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: "$user" },

            // Media.audio
            {
                $lookup: {
                    from: 'audios',
                    localField: 'media.audio',
                    foreignField: '_id',
                    as: 'media.audio'
                }
            },
            { $unwind: { path: "$media.audio", preserveNullAndEmptyArrays: true } },

            // Media.taggedUsers.user
            {
                $lookup: {
                    from: 'users',
                    localField: 'media.taggedUsers.user',
                    foreignField: '_id',
                    as: 'taggedUsers'
                }
            },

            // Collabs.user
            {
                $lookup: {
                    from: 'users',
                    localField: 'collabs.user',
                    foreignField: '_id',
                    as: 'collabUsers'
                }
            },

            // Quest
            {
                $lookup: {
                    from: 'quests',
                    localField: 'quest',
                    foreignField: '_id',
                    as: 'quest'
                }
            },
            { $unwind: { path: "$quest", preserveNullAndEmptyArrays: true } },

            // Description.mention
            {
                $lookup: {
                    from: 'users',
                    localField: 'description.mention',
                    foreignField: '_id',
                    as: 'mentions'
                }
            }
        );
        const getFlicks = await FLICKS.aggregate(pipeline);
        if (!getFlicks) {
            return handleResponse(res, 304, errors.no_flicks)
        }
        // let response = await getAllFlicksAggregation(user, req.query.params as string)
        // if(!response){
        //     return handleResponse(res, 304, errors.no_flicks)
        // }
        const likeData = await Promise.all(
            getFlicks.map(flick =>
                redis.hgetall(`flick:likes:${flick._id}`)
            )
        );
        const commentData = await Promise.all(
            getFlicks.map(flick =>
                redis.hgetall(`flick:comments:${flick._id}`)
            )
        );
        const mergedFeed = getFlicks.map((flick, idx) => (
            {
                ...flick,
                likeCount: Number(likeData[idx]?.count || flick.likeCount || 0),
                commentCount: Number(commentData[idx]?.count || flick.commentCount || 0),
            }));
        return handleResponse(res, 200, { flicks: mergedFeed })
    } catch (error) {
        sendErrorToDiscord("GET:get-all-flicks", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}