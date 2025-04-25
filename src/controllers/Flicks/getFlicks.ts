import { Request, Response } from 'express';
import { validateGetFlicks } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { FLICKS } from '../../models/Flicks/flicks.model';
import { redis } from '../../config/redis/redis.config';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import mongoose from 'mongoose';

export const getAllFlicks = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetFlicks(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const userId = res.locals.userId;
        let { type, limit = 10, page = 1 } = req.query as {
            type?: string;
            limit?: number;
            page?: number;
        };

        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;

        const pipeline: any[] = [];

        // 1. Match based on type
        const matchStage: any = {};
        if (type === 'tagged') {
            matchStage.$or = [
                { "media.taggedUsers.user": new mongoose.Types.ObjectId(userId) },
                { "description.mention": new mongoose.Types.ObjectId(userId) }
            ];
        } else if (type === 'self') {
            matchStage.user = new mongoose.Types.ObjectId(userId);
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // 2. Populate user info
        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { _id: 1, name: 1, username: 1, photo: 1 } }]
                }
            },
            { $unwind: '$user' }
        );

        // 3. Populate media audio
        pipeline.push(
            {
                $unwind: {
                    path: '$media',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'audios',
                    localField: 'media.audio',
                    foreignField: '_id',
                    as: 'mediaAudio'
                }
            },
            {
                $addFields: {
                    'media.audio': { $first: '$mediaAudio' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'media.taggedUsers.user',
                    foreignField: '_id',
                    as: 'taggedUsers',
                    pipeline: [{ $project: { _id: 1, name: 1, username: 1, photo: 1 } }]
                }
            },
            {
                $addFields: {
                    'media.taggedUsers.user': { $first: '$taggedUsers' }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    doc: { $first: '$$ROOT' },
                    media: { $push: '$media' }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$doc', { media: '$media' }]
                    }
                }
            }
        );
        // 5. Lookup collab users
        pipeline.push(
            {
                $unwind: {
                    path: '$collabs',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'collabs.user',
                    foreignField: '_id',
                    as: 'collabs',
                    pipeline: [{ $project: { _id: 1, name: 1, username: 1, photo: 1 } }]
                }
            },
        );
        // 6. Lookup description mentions
        pipeline.push(
            {
                $unwind: {
                    path: '$media',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'description.mention',
                    foreignField: '_id',
                    as: 'description.mentionInfo',
                    pipeline: [
                        { $project: { _id: 1, name: 1, username: 1, photo: 1 } }
                    ]
                }
            },
            {
                $addFields: {
                    'description.mention': '$description.mentionInfo'
                }
            },
            {
                $unset: 'description.mentionInfo'
            },
            {
                $group: {
                    _id: '$_id',
                    doc: { $first: '$$ROOT' },
                    description: { $push: '$description' }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$doc', { media: '$media' }]
                    }
                }
            }
        );

        // 7. Final facet for pagination + total count
        pipeline.push({
            $facet: {
                results: [
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: 'count' }
                ]
            }
        });

        const aggregationResult = await FLICKS.aggregate(pipeline);

        const flicks = aggregationResult[0]?.results || [];
        const totalCount = aggregationResult[0]?.totalCount[0]?.count || 0;

        if (!flicks.length) {
            return handleResponse(res, 404, errors.no_flicks);
        }

        // 8. Fetch like & comment counts from Redis
        const [likeData, commentData] = await Promise.all([
            Promise.all(flicks.map((flick: any) => redis.hgetall(`flick:likes:${flick._id}`))),
            Promise.all(flicks.map((flick: any) => redis.hgetall(`flick:comments:${flick._id}`)))
        ]);

        const mergedFeed = flicks.map((flick: any, idx: number) => ({
            ...flick,
            likeCount: Number(likeData[idx]?.count || 0),
            commentCount: Number(commentData[idx]?.count || 0),
        }));

        return handleResponse(res, 200, {
            flicks: mergedFeed,
            totalDocuments: totalCount,
            page: Number(page) || 1,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.error(error);
        sendErrorToDiscord('GET:get-all-flicks', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
