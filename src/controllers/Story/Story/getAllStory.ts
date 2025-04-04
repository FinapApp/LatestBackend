import { Request, Response } from 'express'
import { errors, handleResponse } from '../../../utils/responseCodec';
import { getAllStoriesAggregation } from '../../../aggregation/getAllStoriesAggregation';
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';

export const getAllStory = async (req: Request, res: Response) => {
    try {
        const user = res.locals.userId
        let response = await getAllStoriesAggregation(user)
        if (!response) {
            return handleResponse(res, 304, errors.no_flicks)
        }
        return handleResponse(res, 200, { response })
    } catch (error) {
        sendErrorToDiscord("GET:get-all-stories", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}