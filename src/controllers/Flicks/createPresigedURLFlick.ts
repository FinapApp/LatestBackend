import { Request, Response } from "express";
import { validatePresignedFlick } from "../../validators/validators";
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
        const { mediaFiles, thumbnailName, audioName, audioFileType } = req.body;
        const flickId = new mongoose.Types.ObjectId();
        // Create reel document without media URLs
        if (flickId) {
            let mediaSignedURLs,thumbnailSignedURLs,audioPresignedURL;
            if (mediaFiles) {
                mediaSignedURLs =await Promise.all(mediaFiles.map((fileName: string, fileType: string) => generateSignedURL(`${user}/flick/${flickId}/videos/${fileName}` , fileType)))
            }
            if (thumbnailName) {
                thumbnailSignedURLs = await generateSignedURL(`/user/${user}/flick/${flickId}/thumbnail`);
            }
            if (audioName) {
                const audioPath = `/user/${user}/flick/audio/${flickId}/${audioName}`;
                audioPresignedURL = await generateSignedURL(audioPath , audioFileType);
            }
            return handleResponse(res, 200, {
                flickId,
                mediaUploadURLs: mediaSignedURLs,
                thumbnailUploadURL: thumbnailSignedURLs,
                audioUploadURL: audioPresignedURL
            });
        }
        return handleResponse(res, 500, errors.create_flick);
    } catch (error) {
        sendErrorToDiscord("create-flicks", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};