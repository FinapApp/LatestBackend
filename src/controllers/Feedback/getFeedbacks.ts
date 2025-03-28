import { Request, Response } from 'express'
import { validateGetAllFlicks } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { FEEDBACK } from '../../models/Feedback/feedback.model';

export const getAllFeedbacks = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetAllFlicks(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.
                validation, validationError.details);
        }
        const user  = res.locals.userId
        let FEEDBACKS = await FEEDBACK.find({user})
        if(FEEDBACKS){
        return handleResponse(res, 200, {FEEDBACKS})
        }
        return handleResponse(res, 200, errors.get_feedback)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error)
    }
}