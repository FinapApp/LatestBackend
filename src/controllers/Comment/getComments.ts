import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import {  validateGetComments } from '../../validators/validators';
import { errors, handleResponse } from '../../utils/responseCodec';
import { COMMENT } from '../../models/Comment/comment.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
export const getComments = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetComments(req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { flickId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;
        const pipeline = [
            { $match: { flick: new mongoose.Types.ObjectId(flickId) } },
            { $sort: { createdAt: -1 as 1 | -1 } },
            {
                $facet: {
                    results: [
                        { $skip: skip },
                        { $limit: limit },
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
                                user: 1
                            }
                        }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ];
        const [aggregationResult] = await COMMENT.aggregate(pipeline);
        const comments = aggregationResult?.results || [];
        const totalCount = aggregationResult?.totalCount[0]?.count || 0;
        return handleResponse(res, 200, {
            comments,
                totalDocuments: totalCount,
                page: Number(page) || 1,
                totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        sendErrorToDiscord("GET:get-comments", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};