import { Request, Response } from "express";
import {  validatePresinedURLQuest } from "../../../validators/validators";
import Joi from "joi";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { generateSignedURL } from "../../../utils/getSignedURL";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import mongoose from "mongoose";

export const createPresignedURLQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePresinedURLQuest(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        // Extract metadata without media URLs
        const { media } = req.body;
        const questId = new mongoose.Types.ObjectId();
        const userId = res.locals.userId as string;
        // Create reel document without media URLs
        if (questId) {
            const mediaPresignedURLs = await Promise.all(media.map((metadata: {
                fileName: string;
                fileType: string;
            }) => generateSignedURL(`user/${userId}/quest/${questId}/${metadata.fileName}`, metadata.fileType)));
            return handleResponse(res, 200, {
                userId,
                questId,
                mediaPresignedURLs
            });
        }
        return handleResponse(res, 500, errors.unable_to_create_signedURL);
    } catch (error) {
        sendErrorToDiscord("create-flicks", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};