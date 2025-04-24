import { Request, Response } from 'express'
import {  validateGetFeedback } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { FEEDBACK } from '../../models/Feedback/feedback.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getAllFeedBacks = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetFeedback(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.
                validation, validationError.details);
        }
        const user = res.locals.userId
        let { type, rating, limit = 10, page = 1 } = req.query as {
            type?: 'pending' | 'resolved',
            rating?: '1' | '2' | '3' | '4' | '5',
            limit?: string,
            page?: string
        }
        const pipeline: any[] = [];
        limit = Number(limit)
        const skip = ((Number(page) || 1) - 1) * limit;

        switch (type) {
            case "pending":
                pipeline.push(
                    {
                        $match: {
                            status: "pending",
                            user: user
                        }
                    }
                )
                break;
            case "resolved":
                pipeline.push(
                    {
                        $match: {
                            status: "resolved",
                            user: user
                        }
                    }
                )
                break;
            default:
                pipeline.push(
                    {
                        $match: {
                            user: user
                        }
                    }
                )
                break;
        }
        if (rating) {
            pipeline.push(
                {
                    $match: {
                        rating: Number(rating),
                        user: user
                    }
                }
            )
        }
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    "user._id": 1,
                    "user.name": 1,
                    "user.photo": 1,
                    "user.username": 1,
                    message: 1,
                    rating: 1,
                    status: 1,
                }
            }
        );
        let feedBacks = await FEEDBACK.aggregate(pipeline)
        if (feedBacks) {
            return handleResponse(res, 200, { feedBacks })
        }
        return handleResponse(res, 200, errors.get_feedback)
    } catch (error) {
        sendErrorToDiscord("GET:get-all-feedBacks", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}