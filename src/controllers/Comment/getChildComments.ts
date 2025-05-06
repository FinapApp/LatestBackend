import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import { COMMENT } from '../../models/Comment/comment.model';
import { validateGetChildComment } from '../../validators/validators';
import { errors, handleResponse } from '../../utils/responseCodec';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getChildComments = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetChildComment(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { commentId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        limit = Number(limit);
        page = Number(page)
        const skip = page <= 1 ? 0 : 4 + ((page- 2) * limit);
        const userId = res.locals.userId;
        if (!userId) {
            return handleResponse(res, 400, errors.validation, [{ message: 'User ID is required' }]);
        }
        const totalDocuments = await COMMENT.countDocuments({
            parentComment: new mongoose.Types.ObjectId(commentId)
        });

        const replies = await COMMENT.aggregate([
            {
                $match: {
                    parentComment: new mongoose.Types.ObjectId(commentId)
                }
            },
            { $sort: { createdAt: 1 } },
            { $skip: skip },
            { $limit: limit },
            // Like info
            {
                $lookup: {
                    from: 'likes',
                    let: { commentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$comment', '$$commentId'] },
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
            // User info
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
        ]);

        return handleResponse(res, 200, {
            replies,
            totalDocuments,
            page: Number(page),
            totalPages: Math.ceil(totalDocuments / limit)
        });
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("GET:get-child-comments", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
