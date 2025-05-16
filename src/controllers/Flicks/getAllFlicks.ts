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

        const currentUserId = new mongoose.Types.ObjectId(res.locals.userId);
        let { type, limit = 10, page = 1, userId } = req.query as {
            type?: string;
            limit?: number;
            page?: number;
            userId?: string;
        };

        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;

        const pipeline: any[] = [];
        const matchStage: any = {};

        if (type === 'tagged') {
            matchStage.$or = [
                { "media.taggedUsers.user": currentUserId },
                { "description.mention": currentUserId }
            ];
        } else if (type === 'self') {
            matchStage.user = currentUserId;
        } else if (type === 'user' && userId) {
            matchStage.user = new mongoose.Types.ObjectId(userId);
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'userfollowers',
                                let: { flickUserId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$follower', currentUserId] },
                                                    { $eq: ['$following', '$$flickUserId'] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: 'followCheck'
                            }
                        },
                        {
                            $addFields: {
                                isFollowing: { $gt: [{ $size: '$followCheck' }, 0] }
                            }
                        },
                        { $unset: 'followCheck' },
                        { $project: { _id: 1, name: 1, username: 1, photo: 1, isFollowing: 1 } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'songs',
                    localField: 'song',
                    foreignField: '_id',
                    as: 'song',
                    pipeline: [
                        { $project: { _id: 1, name: 1, url: 1, icon: 1, used: 1, duration: 1, artist: 1 } }
                    ]
                }
            },
            { $unwind: { path: '$song', preserveNullAndEmptyArrays: true } },
            { $unwind: '$user' },
            { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'quests',
                    localField: 'quest',
                    foreignField: '_id',
                    as: 'quest'
                }
            },
            {
                $addFields: {
                    'media.audio': { $arrayElemAt: ['$mediaAudio', 0] }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { taggedUsers: '$media.taggedUsers.user' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$_id', '$$taggedUsers'] } } },
                        { $project: { _id: 1, name: 1, username: 1, photo: 1 } }
                    ],
                    as: 'mediaTaggedUsers'
                }
            },
            {
                $addFields: {
                    'media.taggedUsers': {
                        $map: {
                            input: '$media.taggedUsers',
                            as: 'tagged',
                            in: {
                                text: '$$tagged.text',
                                position: '$$tagged.position',
                                user: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$mediaTaggedUsers',
                                                as: 'userDoc',
                                                cond: { $eq: ['$$userDoc._id', '$$tagged.user'] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    mediaAudio: 0,
                    mediaTaggedUsers: 0
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
            },
            {
                $lookup: {
                    from: 'likes',
                    let: { flickId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$flick", "$$flickId"] },
                                        { $eq: ["$user", currentUserId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userLiked"
                }
            },
            {
                $addFields: {
                    isLiked: { $gt: [{ $size: "$userLiked" }, 0] }
                }
            },
            { $unset: "userLiked" },
            {
                $facet: {
                    results: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        );

        const aggregationResult = await FLICKS.aggregate(pipeline);
        const flicks = aggregationResult[0]?.results || [];
        const totalCount = aggregationResult[0]?.totalCount[0]?.count || 0;

        if (!flicks.length) {
            return handleResponse(res, 404, errors.no_flicks);
        }

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
