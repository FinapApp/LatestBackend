import { Request, Response } from 'express';
import Joi from 'joi';
import { errors, handleResponse, Lang, success } from '../../utils/responseCodec';
import { FEEDBACK } from '../../models/Feedback/feedback.model';
import { validateFeedbackId } from '../../validators/validators';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
export const deleteFeedback = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateFeedbackId(req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const feedbackId = req.params.feedbackId;
        const feedback = await FEEDBACK.findOneAndDelete(
            {
                _id: feedbackId,
                user: res.locals.userId
            }
        );
        if (feedback) {
            return handleResponse(res, 200, success.delete_feedback , lang);
        }
        return handleResponse(res, 500, errors.delete_feedback , lang);
    } catch (err) {
        sendErrorToDiscord('DELETE:delete-feedback', err);
        return handleResponse(res, 500, errors.catch_error , lang);
    }
}