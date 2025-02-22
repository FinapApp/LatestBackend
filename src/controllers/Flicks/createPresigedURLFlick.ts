import { Request, Response } from "express";
import {  validatePresignedFlick } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { generateSignedURL } from "../../utils/getSignedURL";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import mongoose from "mongoose";

export const createPresignedURLFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePresignedFlick(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId;
        // Extract metadata without media URLs
        const { videoURL, photos, thumbnailURL, audio } = req.body;
        const flickId = new mongoose.Types.ObjectId();
        // Create reel document without media URLs
        if (flickId) {
            let videoPresignedUrl, photoPresignedUrls, audioPresignedURL
            if (videoURL) {
                const videoPath = `${user}/flick/videos/${flickId}/${videoURL}`;
                videoPresignedUrl = await generateSignedURL(videoPath);
            }
            if (photos) {
                photoPresignedUrls = await Promise.all(photos.map((path: string) => generateSignedURL(`${user}/flick/photos/${flickId}/${path}`)));
            }
            if (audio) {
                const audioPath = `${user}/flick/audio/${flickId}/${audio}`;
                audioPresignedURL = await generateSignedURL(audioPath);
            }
            const thumbnailPath = `${user}/flick/thumbnails/${flickId}/${thumbnailURL}`;
            const thumbnailPresignedUrl = await generateSignedURL(thumbnailPath);
            // Respond with presigned URLs and reel ID
            return handleResponse(res, 200, {
                flickId,
                videoUploadURL: videoPresignedUrl,
                photoUploadURL: photoPresignedUrls,
                thumbnailUploadURL: thumbnailPresignedUrl,
                audioUploadURL: audioPresignedURL
            });
        }
        return handleResponse(res, 500, errors.create_flick);
    } catch (error) {
        sendErrorToDiscord("create-flicks", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};