import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse, Lang } from "../../../utils/responseCodec";
import { validateStoryId } from "../../../validators/validators";
import { STORYVIEW } from "../../../models/Stories/storyView.model";

export const getStoryViewers = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateStoryId(req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const storyId = req.params.storyId;
        const storyView = await STORYVIEW.find({ story: storyId });
        if (storyView) {
            return handleResponse(res, 200, { 
                storyViews :  storyView });
        }
        return handleResponse(res, 500, errors.get_story_view, lang);
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error, lang);
    }
}