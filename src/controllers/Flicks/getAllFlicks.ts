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
            type?: 'profile' | 'tagged';
            limit?: number;
            page?: number;
            userId?: string;
        };

        limit = Number(limit);
        page = Number(page);
        const skip = (page - 1) * limit;

        const targetUserId = new mongoose.Types.ObjectId(userId || currentUserId);
        const pipeline: any[] = [];

        const matchStage: any = {};
        if (type === 'tagged') {
            matchStage.$or = [
                { "media.taggedUsers.user": targetUserId },
                { "description.mention": targetUserId }
            ];
        } else if (type === 'profile') {
            matchStage.user = targetUserId;
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Audience Filter: restrict based on audienceSetting
        pipeline.push(
            {
                $lookup: {
                    from: 'userfollowers',
                    let: { flickUserId: '$user' },
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
                    as: 'isFollowing'
                }
            },
            {
                $addFields: {
                    isFollowing: { $gt: [{ $size: '$isFollowing' }, 0] }
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audienceSetting', 'public'] },
                            {
                                $and: [
                                    { $eq: ['$audienceSetting', 'friends'] },
                                    {
                                        $or: [
                                            { $eq: ['$isFollowing', true] },
                                            { $eq: ['$user', currentUserId] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        );

        // Remove flicks reported and filtered
        pipeline.push(
            {
                $lookup: {
                    from: 'reports',
                    let: { flickId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$flick', '$$flickId'] },
                                        { $in: ['$status', ['pending', 'resolved']] }
                                    ]
                                }
                            }
                        },
                        { $project: { user: 1, status: 1 } }
                    ],
                    as: 'reports'
                }
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $not: { $in: ['resolved', '$reports.status'] } },
                            {
                                $not: {
                                    $in: [true, {
                                        $map: {
                                            input: '$reports',
                                            as: 'r',
                                            in: {
                                                $and: [
                                                    { $eq: ['$$r.user', currentUserId] },
                                                    { $eq: ['$$r.status', 'pending'] }
                                                ]
                                            }
                                        }
                                    }]
                                }
                            }
                        ]
                    }
                }
            },
            { $unset: 'reports' }
        );

        // Enrich data
        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$user' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$userId'] },
                                        { $ne: ['$isDeactivated', true] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1, name: 1, username: 1, photo: 1, createdAt: 1, location: 1, country: 1
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            { $match: { user: { $ne: null } } },
            {
                $lookup: {
                    from: 'songs',
                    localField: 'song',
                    foreignField: '_id',
                    pipeline: [
                        { $project: { _id: 1, name: 1, url: 1, icon: 1, used: 1, duration: 1, artist: 1 } }
                    ],
                    as: 'song'
                }
            },
            { $unwind: { path: '$song', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'flicks',
                    localField: 'repost',
                    foreignField: '_id',
                    as: 'repost',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'user',
                                foreignField: '_id',
                                pipeline: [{ $project: { _id: 1, username: 1, photo: 1, name: 1 } }],
                                as: 'user'
                            }
                        },
                        { $unwind: '$user' },
                        { $project: { _id: 1, user: 1 } }
                    ]
                }
            },
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
                        {
                            $lookup: {
                                from: 'userfollowers',
                                let: { taggedUserId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$follower', '$$taggedUserId' ] },
                                                    { $eq: ['$following', currentUserId ] }
                                                ]
                                            }
                                        }
                                    },
                                    { $project: { _id: 1 } }
                                ],
                                as: 'isFollowedByCurrentUser'
                            }
                        },
                        {
                            $addFields: {
                                isFollowing: {
                                    $gt: [{ $size: '$isFollowedByCurrentUser' }, 0]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                username: 1,
                                photo: 1,
                                isFollowing: 1
                            }
                        }
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
                                    $let: {
                                        vars: {
                                            userDoc: {
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
                                        },
                                        in: {
                                            _id: '$$userDoc._id',
                                            name: '$$userDoc.name',
                                            username: '$$userDoc.username',
                                            photo: '$$userDoc.photo',
                                            isFollowing: '$$userDoc.isFollowing'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    mediaAudio: 0,
                    mediaTaggedUsers: 0,
                }
            },
            {
                $group: {
                    _id: '$_id',
                    createdAt: { $first: '$createdAt' },
                    doc: { $first: '$$ROOT' },
                    media: { $push: '$media' }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$doc', { media: '$media', createdAt: '$createdAt' }]
                    }
                }
            },
            {
                $addFields: {
                    repost: {
                        $cond: {
                            if: { $gt: [{ $size: "$repost" }, 0] },
                            then: "$repost",
                            else: "$$REMOVE"
                        }
                    },
                    quest: {
                        $cond: {
                            if: { $gt: [{ $size: "$quest" }, 0] },
                            then: "$quest",
                            else: "$$REMOVE"
                        }
                    },
                    canComment: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ['$commentSetting', 'everyone'] },
                                    then: true
                                },
                                {
                                    case: { $and: [{ $eq: ['$commentSetting', 'friends'] }, { $eq: ['$isFollowing', true] }] },
                                    then: true
                                }
                            ],
                            default: false
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } },
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
                $project: {
                    _id: 1,
                    user: 1,
                    repost: 1,
                    media: 1,
                    location: 1,
                    gps: 1,
                    thumbnailURL: 1,
                    description: 1,
                    quest: 1,
                    song: 1,
                    songStart: 1,
                    songEnd: 1,
                    repostCount: 1,
                    suspended: 1,
                    suspendedReason: 1,
                    commentVisible: 1,
                    likeVisible: 1,
                    repostVisible: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    isFollowing: 1,
                    canComment: 1,
                    isLiked: 1,
                    likeCount: 1,
                    commentSetting: {
                        $cond: {
                            if: false,
                            then: '$commentSetting',
                            else: '$$REMOVE'
                        }
                    },
                    audienceSetting: {
                        $cond: {
                            if: false,
                            then: '$audienceSetting',
                            else: '$$REMOVE'
                        }
                    },
                    commentCount: {
                        $cond: {
                            if: '$canComment',
                            then: '$commentCount',
                            else: { $literal: undefined }
                        }
                    }
                }
            },
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
            page: page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.error(error);
        sendErrorToDiscord('GET:get-all-flicks', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
