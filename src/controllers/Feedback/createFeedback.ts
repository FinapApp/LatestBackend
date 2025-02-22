import { Request, Response } from 'express'
import { FEEDBACK } from "../../models/Feedback/feedback.model";
import { validateCreateFeedback } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFeedback(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { message, rating } = req.body;
        const feedback = await FEEDBACK.create({
            user: res.locals.userId,
            message,
            rating
        });
        if (feedback) {
            return handleResponse(res, 200, success.create_feedback)
        }
        return handleResponse(res, 500, errors.create_feedback);
    } catch (err) {
        return handleResponse(res, 500, errors.catch_error)
    }
}