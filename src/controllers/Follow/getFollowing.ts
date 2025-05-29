import { Request, Response } from 'express'
import { getQueryParams } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { getAllFollowingUserAggreagtion } from '../../aggregation/getAllFollowingUserAggreagtion';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import mongoose from 'mongoose';

export const getFollowing = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = getQueryParams(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        let { page, userId, limit = 10 } = req.query as any;
        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;
        const currentUserId = new mongoose.Types.ObjectId(res.locals.userId);
        const targetUserId = new mongoose.Types.ObjectId(userId || currentUserId);

        // Only include isFollowing field if viewing someone else's following list
        const result = await getAllFollowingUserAggreagtion(
            currentUserId,
            targetUserId,
            skip,
            limit
        );
        
        return handleResponse(res, 200, result);
    } catch (error) {
        console.log(error);
        sendErrorToDiscord("GET:following", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};