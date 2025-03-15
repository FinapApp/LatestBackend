import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { STORY } from "../../../models/Stories/story.model";
import { validateCreateStory } from "../../../validators/validators";

export const createStory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateStory(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const storyId = req.params.storyId;
        const story = await STORY.create({
            _id: storyId,
            user,
            ...req.body
        });
        if (!story) {
            return handleResponse(res, 404, errors.story_uploaded);
        }
        return handleResponse(res, 200, success.story_uploaded);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};