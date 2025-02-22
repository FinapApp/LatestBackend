import { Request, Response } from "express"
import Joi from "joi";
import {  validateStoryId } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import { STORY } from "../../../models/Stories/story.model";

export const deleteStory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateStoryId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteStory = await STORY.findByIdAndDelete(req.params.storyId)
        if (deleteStory) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.story_deleted)
        }
        return handleResponse(res, 404, errors.story_deleted)
    } catch (error) {
        return handleResponse(res, 500, errors.catch_error)
    }
}
