import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { validateGetAllLikes } from '../../validators/validators';
import { errors, handleResponse } from '../../utils/responseCodec';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import { LIKE } from '../../models/Likes/likes.model';

export const getAllLikes = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetAllLikes(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { id, type }: { id: string, type: 'quest' | 'comment' | 'flick' } =
            req.query as { id: string, type: 'quest' | 'comment' | 'flick' };

        // Step 1: Build dynamic match field
        const matchQuery: any = {};
        matchQuery[type] = new mongoose.Types.ObjectId(id);

        // Step 2: Aggregate
        const likeList = await LIKE.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $match: {
                    'user.isDeactivated': { $ne: true }
                }
            },
            {
                $project: {
                    _id: 0,
                    user: {
                        _id: '$user._id',
                        username: '$user.username',
                        photo: '$user.photo',
                        updatedAt: '$user.updatedAt',
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        if (!likeList) {
            return handleResponse(res, 404, errors.comment_not_found);
        }

        return handleResponse(res, 200, { likeList });

    } catch (error) {
        sendErrorToDiscord("GET:get-likes", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
