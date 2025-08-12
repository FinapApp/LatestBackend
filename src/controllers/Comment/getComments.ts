import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { validateGetComments } from '../../validators/validators';
import { errors, handleResponse, Lang } from '../../utils/responseCodec';
import { COMMENT } from '../../models/Comment/comment.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getComments = async (req: Request, res: Response) => {
    const lang = (req.query.lang as Lang) || 'en';
    try {
        const validationError: Joi.ValidationError | undefined =
            validateGetComments(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }

        const { flickId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        page = Number(page) || 1;
        limit = Number(limit);
        const skip = (page - 1) * limit;

        const userId = res.locals.userId;

        const results = await COMMENT.aggregate([
            {
                $match: {
                    flick: new mongoose.Types.ObjectId(flickId),
                    parentComment: null
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
            { $unwind: '$userData' },
            {
                $match: {
                    'userData.isDeactivated': { $ne: true }
                }
            },
            {
                $facet: {
                    totalCount: [{ $count: 'count' }],

                    comments: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },

                        /** Replies **/
                        {
                            $lookup: {
                                from: 'comments',
                                let: { parentId: '$_id' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$parentComment', '$$parentId'] } } },
                                    { $sort: { createdAt: 1 } },
                                    { $limit: 4 },

                                    // Only lookup for isLiked, likeCount comes directly from comment doc
                                    {
                                        $lookup: {
                                            from: 'likes',
                                            let: { commentId: '$_id' },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $and: [
                                                                { $eq: ['$comment', '$$commentId'] },
                                                                { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ],
                                            as: 'likeMatch'
                                        }
                                    },
                                    {
                                        $addFields: {
                                            isLiked: { $gt: [{ $size: '$likeMatch' }, 0] }
                                        }
                                    },
                                    { $unset: 'likeMatch' },

                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'user',
                                            foreignField: '_id',
                                            as: 'userData'
                                        }
                                    },
                                    { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
                                    { $match: { 'userData.isDeactivated': { $ne: true } } },

                                    {
                                        $project: {
                                            _id: 1,
                                            comment: 1,
                                            createdAt: 1,
                                            user: {
                                                _id: '$userData._id',
                                                username: '$userData.username',
                                                photo: '$userData.photo',
                                                name: '$userData.name',
                                                updatedAt: '$userData.updatedAt'
                                            },
                                            likeCount: 1, // 📌 direct from document
                                            isLiked: 1
                                        }
                                    }
                                ],
                                as: 'replies'
                            }
                        },

                        /** Reply count **/
                        {
                            $lookup: {
                                from: 'comments',
                                let: { parentId: '$_id' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$parentComment', '$$parentId'] } } },
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

                        /** isLiked for main comment **/
                        {
                            $lookup: {
                                from: 'likes',
                                let: { commentId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$comment', '$$commentId'] },
                                                    { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: 'likeMatch'
                            }
                        },
                        { $addFields: { isLiked: { $gt: [{ $size: '$likeMatch' }, 0] } } },
                        { $unset: 'likeMatch' },

                        {
                            $project: {
                                _id: 1,
                                comment: 1,
                                createdAt: 1,
                                user: {
                                    _id: '$userData._id',
                                    username: '$userData.username',
                                    photo: '$userData.photo',
                                    name: '$userData.name',
                                    updatedAt: '$userData.updatedAt'
                                },
                                replies: 1,
                                replyCount: 1,
                                isLiked: 1,
                                likeCount: 1 // 📌 direct from stored field
                            }
                        }
                    ]
                }
            }
        ]);

        const totalDocuments = results[0]?.totalCount[0]?.count || 0;
        const comments = results[0]?.comments || [];

        return handleResponse(res, 200, {
            comments,
            totalDocuments,
            page,
            totalPages: Math.ceil(totalDocuments / limit)
        });
    } catch (error) {
        console.error(error);
        sendErrorToDiscord('GET:get-comments', error);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
  
