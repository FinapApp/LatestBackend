import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { validateStoryId } from "../../../validators/validators";
import { STORYVIEW } from "../../../models/Stories/storyView.model";

export const getStoryViewers = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateStoryId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const storyId = req.params.storyId;
        const storyView = await STORYVIEW.find({ story: storyId });
        if (storyView) {
            return handleResponse(res, 200, { 
                STORYVIEWS :  storyView });
        }
        return handleResponse(res, 500, errors.get_story_view);
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error);
    }
}