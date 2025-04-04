import { Request, Response } from 'express'
import { validateGetAllFlicks } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { FEEDBACK } from '../../models/Feedback/feedback.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getAllFeedBacks = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetAllFlicks(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.
                validation, validationError.details);
        }
        const user = res.locals.userId
        let feedBacks = await FEEDBACK.find({ user } , "-aa", {
            populate : [
                {path: "user", select: "username photo" },
            ]
        } )
        if (feedBacks) {
            return handleResponse(res, 200, { feedBacks })
        }
        return handleResponse(res, 200, errors.get_feedback)
    } catch (error) {
        sendErrorToDiscord("GET:get-all-feedBacks", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}