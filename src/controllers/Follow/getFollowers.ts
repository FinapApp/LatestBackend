import { Request, Response } from 'express'
import { getQueryParams } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { getAllFollowerUserAggreagtion } from '../../aggregation/getAllFollowerUserAggreagtion';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getFollowers = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = getQueryParams(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        let { skip = "0", userId } = req.query
        userId ??= res.locals.userId as string
        const result = await getAllFollowerUserAggreagtion(userId as any, skip as any)
        return handleResponse(res, 200, {followerlist  :result})
    } catch (error) {
        sendErrorToDiscord("GET:followers", error)
        return handleResponse(res, 500, errors.catch_error);
    }
}