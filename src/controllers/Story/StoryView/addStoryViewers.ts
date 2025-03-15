import Joi from "joi";
import { validateAddStoryViewer, validateStoryId } from "../../../validators/validators";
import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { STORYVIEW } from "../../../models/Stories/storyView.model";
import { STORY } from "../../../models/Stories/story.model";

export const addStoryViewer = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateAddStoryViewer(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { storyId } = req.params
        // BATCH PROCESSING 
        const [storyView, updateStoryCount] = await Promise.all([
            STORYVIEW.findByIdAndUpdate({ user: res.locals.userId, story: storyId, reaction: req.body.reaction }),
            STORY.findByIdAndUpdate(storyId, { $inc: { viewCount: 1 } })
        ])
        if (storyView && updateStoryCount) {
            return handleResponse(res, 200, success.add_story_viewer);
        }
        return handleResponse(res, 500, errors.add_story_viewer);
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error);
    }
}