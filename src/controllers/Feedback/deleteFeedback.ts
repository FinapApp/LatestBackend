import { Request, Response } from 'express';
import Joi from 'joi';
import { errors, handleResponse, success } from '../../utils/responseCodec';
import { FEEDBACK } from '../../models/Feedback/feedback.model';
import { validateFeedbackId } from '../../validators/validators';
export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFeedbackId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const feedbackId = req.params.feedbackId;
        const feedback = await FEEDBACK.findByIdAndDelete(feedbackId);
        if (feedback) {
            return handleResponse(res, 200, success.delete_feedback);
        }
        return handleResponse(res, 500, errors.delete_feedback);
    } catch (err) {
        return handleResponse(res, 500, errors.catch_error);
    }
}