import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { STORY } from "../../../models/Stories/story.model";
import { validateCreateStory } from "../../../validators/validators";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { HASHTAGS } from "../../../models/User/userHashTag.model";

export const createStory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateStory(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const storyId = req.params.storyId;
        const { newHashTags, ...rest } = req.body;
        if (newHashTags) {
            const createHashTags = await HASHTAGS.insertMany(newHashTags.map((tag: { id: string, value: string }) => ({ value: tag.value, _id: tag.id })));
            if (!createHashTags) {
                return handleResponse(res, 404, errors.create_hashtags);
            }
        }
        const story = await STORY.create({
            _id: storyId,
            user,
            ...rest
        });
        if (!story) {
            return handleResponse(res, 404, errors.story_uploaded);
        }
        return handleResponse(res, 200, success.story_uploaded);
    } catch (error: any) {
        // console.error(error);
        console.log(error)
        sendErrorToDiscord("POST:create-story", error)
        if (error.code === 11000) {
            return handleResponse(res, 409, errors.story_already_exists);
        }
        return handleResponse(res, 500, errors.catch_error);
    }
};