import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { validateGetComments } from '../../validators/validators';
import { errors, handleResponse } from '../../utils/responseCodec';
import { COMMENT } from '../../models/Comment/comment.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getComments = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetComments(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { flickId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;
        const userId = res.locals.userId;
        const totalCount = await COMMENT.countDocuments({
            flick: new mongoose.Types.ObjectId(flickId),
            parentComment: null
        });

        const comments = await COMMENT.aggregate([
            {
                $match: {
                    flick: new mongoose.Types.ObjectId(flickId),
                    parentComment: null
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'comments',
                    let: { parentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$parentComment', '$$parentId'] }
                            }
                        },
                        { $sort: { createdAt: 1 } },
                        { $limit: 4 },
                        {
                            $lookup: {
                                from: 'likes',
                                let: { commentId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$comment', '$$commentId'] },
                                            value: true
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: null,
                                            likeCount: { $sum: 1 },
                                            isLiked: {
                                                $sum: {
                                                    $cond: [
                                                        { $eq: ['$user', new mongoose.Types.ObjectId(userId)] },
                                                        1,
                                                        0
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ],
                                as: 'likeData'
                            }
                        },
                        {
                            $addFields: {
                                likeCount: {
                                    $ifNull: [{ $arrayElemAt: ['$likeData.likeCount', 0] }, 0]
                                },
                                isLiked: {
                                    $gt: [
                                        { $ifNull: [{ $arrayElemAt: ['$likeData.isLiked', 0] }, 0] },
                                        0
                                    ]
                                }
                            }
                        },
                        { $unset: 'likeData' },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'user',
                                foreignField: '_id',
                                as: 'userData'
                            }
                        },
                        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
                        {
                            $addFields: {
                                user: {
                                    $cond: {
                                        if: { $ne: ['$userData', null] },
                                        then: {
                                            _id: '$userData._id',
                                            username: '$userData.username',
                                            photo: '$userData.photo',
                                            name: '$userData.name'
                                        },
                                        else: null
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                comment: 1,
                                createdAt: 1,
                                user: 1,
                                likeCount: 1,
                                isLiked: 1
                            }
                        }
                    ],
                    as: 'replies'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    let: { parentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$parentComment', '$$parentId'] }
                            }
                        },
                        { $count: 'count' }
                    ],
                    as: 'replyCountData'
                }
            },
            {
                $addFields: {
                    replyCount: {
                        $ifNull: [{ $arrayElemAt: ['$replyCountData.count', 0] }, 0]
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    user: {
                        $cond: {
                            if: { $ne: ['$userData', null] },
                            then: {
                                _id : '$userData._id',
                                username: '$userData.username',
                                photo: '$userData.photo',
                                name: '$userData.name'
                            },
                            else: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "likes",
                    let: { commentId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$comment", "$$commentId"] },
                                value: true
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                likeCount: { $sum: 1 },
                                isLiked: {
                                    $sum: {
                                        $cond: [
                                            { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                                            1,
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    ],
                    as: "likeData"
                }
            },
            {
                $addFields: {
                    likeCount: {
                        $ifNull: [{ $arrayElemAt: ["$likeData.likeCount", 0] }, 0]
                    },
                    isLiked: {
                        $gt: [
                            { $ifNull: [{ $arrayElemAt: ["$likeData.isLiked", 0] }, 0] },
                            0
                        ]
                    }
                }
            },
            { $unset: "likeData" },
            {
                $project: {
                    _id: 1,
                    comment: 1,
                    createdAt: 1,
                    user: 1,
                    replies: 1,
                    replyCount: 1,
                    isLiked: 1,
                    likeCount: 1
                }
            }
        ]);

        return handleResponse(res, 200, {
            comments,
            totalDocuments: totalCount,
            page: Number(page) || 1,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("GET:get-comments", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
