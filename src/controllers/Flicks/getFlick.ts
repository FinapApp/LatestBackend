import { Request, Response } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { errors, handleResponse } from "../../utils/responseCodec";
import { validateFlickId } from "../../validators/validators";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const getFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFlickId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const flickId = new mongoose.Types.ObjectId(req.params.flickId);
        const currentUserId = new mongoose.Types.ObjectId(res.locals.userId);

        const pipeline: any[] = [
            { $match: { _id: flickId } },
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
            },
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
            { $unset: 'reports' },
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
                                _id: 1, name: 1, username: 1, photo: 1,
                                createdAt: 1, location: 1, country: 1
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            { $unwind: '$user' },

            // Song enrichment
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
            { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },

            // Repost
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
                                as: 'user',
                                pipeline: [
                                    { $project: { _id: 1, username: 1, photo: 1, name: 1 } }
                                ]
                            }
                        },
                        { $unwind: '$user' },
                        { $project: { _id: 1, user: 1 } }
                    ]
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

            // Media audio
            {
                $addFields: {
                    'media.audio': { $arrayElemAt: ['$mediaAudio', 0] }
                }
            },

            // Tagged users
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
                                                    { $eq: ['$follower', '$$taggedUserId'] },
                                                    { $eq: ['$following', currentUserId] }
                                                ]
                                            }
                                        }
                                    }
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
                                _id: 1, name: 1, username: 1, photo: 1, isFollowing: 1
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
                    mediaTaggedUsers: 0
                }
            },

            // Merge media
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

            // Cleanup repost/quest
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
                                { case: { $eq: ['$commentSetting', 'everyone'] }, then: true },
                                {
                                    case: {
                                        $and: [
                                            { $eq: ['$commentSetting', 'friends'] },
                                            { $eq: ['$isFollowing', true] }
                                        ]
                                    },
                                    then: true
                                }
                            ],
                            default: false
                        }
                    }
                }
            },

            // Like info
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
            { $unset: "userLiked" }
        ];

        const flickResult = await FLICKS.aggregate(pipeline);
        const flick = flickResult[0];

        if (!flick) {
            return handleResponse(res, 404, errors.no_flicks);
        }

        return handleResponse(res, 200, flick);
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("GET:get-flick", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
