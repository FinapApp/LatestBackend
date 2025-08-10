import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { STORY } from "../../../models/Stories/story.model";
import { validateCreateStory } from "../../../validators/validators";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { HASHTAGS } from "../../../models/User/userHashTag.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";

export const createStory = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateStory(req.body, req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const user = res.locals.userId
        const storyId = req.params.storyId;
        const { newHashTags, ...rest } = req.body;
        if (newHashTags) {
            const createHashTags = await HASHTAGS.insertMany(newHashTags.map((tag: { id: string, value: string }) => ({ value: tag.value, _id: tag.id })));
            const hashTagIndex = getIndex("HASHTAG");
            await hashTagIndex.addDocuments(newHashTags.map((tag: { id: string, value: string }) => ({ hashtagId: tag.id, value: tag.value, count: 1 })));
            if (!createHashTags) {
                return handleResponse(res, 404, errors.create_hashtags, lang);
            }
        }
        const story = await STORY.create({
            _id: storyId,
            user,
            ...rest
        });
        if (!story) {
            return handleResponse(res, 404, errors.story_uploaded, lang);
        }
        return handleResponse(res, 200, success.story_uploaded, lang);
    } catch (error: any) {
        // console.error(error);
        console.log(error)
        sendErrorToDiscord("POST:create-story", error)
        if (error.code === 11000) {
            return handleResponse(res, 409, errors.story_already_exists, lang);
        }
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};