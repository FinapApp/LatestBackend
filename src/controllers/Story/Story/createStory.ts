import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { STORY } from "../../../models/Stories/story.model";
import { validateCreateStory } from "../../../validators/validators";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

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
    } catch (error:any) {
        // console.error(error);
        sendErrorToDiscord("POST:create-story", error)
        if(error.code === 11000) {
            return handleResponse(res, 409, errors.story_already_exists);
        }
        return handleResponse(res, 500, errors.catch_error);
    }
};