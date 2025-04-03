import { Request, Response } from "express";
import { validateUpdateFeedback } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FEEDBACK } from "../../models/Feedback/feedback.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const updateFeedback = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateFeedback(req.body , req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const feedbackId = req.params.feedbackId;
        const feedback = await FEEDBACK.findByIdAndUpdate(feedbackId, req.body, { new: true });
        if (feedback) {
            return handleResponse(res, 200, success.update_feedback);
        }   
        return handleResponse(res, 500, errors.update_feedback);
    } catch (error) {
        sendErrorToDiscord("PUT:update-feedback", error);
        return handleResponse(res, 500, errors.catch_error);
    }
}