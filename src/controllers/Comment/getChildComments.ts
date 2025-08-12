import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import { COMMENT } from '../../models/Comment/comment.model';
import { validateGetChildComment } from '../../validators/validators';
import { errors, handleResponse, Lang } from '../../utils/responseCodec';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getChildComments = async (req: Request, res: Response) => {
    const lang = (req.query.lang as Lang) || 'en';
    try {
        const validationError: Joi.ValidationError | undefined =
            validateGetChildComment(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }

        const { commentId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        page = Number(page) || 1;
        limit = Number(limit);
        const skip = (page - 1) * limit;
        const userId = res.locals.userId;

        // Count replies for pagination
        const totalDocuments = await COMMENT.countDocuments({
            parentComment: new mongoose.Types.ObjectId(commentId)
        });

        // Get replies with stored likeCount and isLiked check
        const replies = await COMMENT.aggregate([
            {
                $match: {
                    parentComment: new mongoose.Types.ObjectId(commentId)
                }
            },
            { $sort: { createdAt: 1 } },
            { $skip: skip },
            { $limit: limit },

            // Minimal lookup only for isLiked
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

            // Join user data
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
                                name: '$userData.name',
                                updatedAt: '$userData.updatedAt'
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
                    likeCount: 1, // 📌 directly from stored field
                    isLiked: 1
                }
            }
        ]);

        return handleResponse(res, 200, {
            replies,
            totalDocuments,
            page,
            totalPages: Math.ceil(totalDocuments / limit)
        });
    } catch (error) {
        console.error(error);
        sendErrorToDiscord('GET:get-child-comments', error);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
