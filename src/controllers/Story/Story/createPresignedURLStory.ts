import { Request, Response } from "express";
import { validateStoryUpload } from "../../../validators/validators";
import Joi from "joi";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { generateSignedURL } from "../../../utils/s3.utils";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import mongoose from "mongoose";

export const createPresignedURLStory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateStoryUpload(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId;
        const { fileType, fileName } = req.body
        // Extract metadata without media URLs
        const storyId = new mongoose.Types.ObjectId();
        const uploadPath = `user/${user}/story/${storyId}/${fileName}`;
        const thumbnailImagePath = `user/${user}/story/${storyId}/thumbnail`;
        const [thumbnailSignedURL , mediaSignedURL] = await Promise.all([
            generateSignedURL(thumbnailImagePath),
            generateSignedURL(uploadPath , fileType)
        ]);
        return handleResponse(res, 200, {
            storyId,
            mediaSignedURL,
            thumbnailSignedURL
        });
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("create-story", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};