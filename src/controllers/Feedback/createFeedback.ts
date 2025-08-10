import { Request, Response } from 'express'
import { FEEDBACK } from "../../models/Feedback/feedback.model";
import { validateCreateFeedback } from "../../validators/validators";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const createFeedback = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFeedback(req.body , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const { message, rating } = req.body;
        const feedback = await FEEDBACK.create({
            user: res.locals.userId,
            message: { sentBy: 'user', message },
            rating
        });
        if (feedback) {
            return handleResponse(res, 200, success.create_feedback , lang);
        }
        return handleResponse(res, 500, errors.create_feedback , lang);
    } catch (err) {
        sendErrorToDiscord("POST:create-feedback", err)
        return handleResponse(res, 500, errors.catch_error  , lang);
    }
}