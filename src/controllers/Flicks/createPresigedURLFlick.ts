import { Request, Response } from "express";
import { validatePresignedFlick } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
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
        const { mediaFiles, audioName, audioFileType } = req.body;
        const flickId = new mongoose.Types.ObjectId();
        // Create reel document without media URLs
        if (flickId) {
            let mediaSignedURL, thumbnailSignedUrl, audioSignedURL;
            if (mediaFiles) {
                mediaSignedURL = await Promise.all(mediaFiles.map((x: { fileName: string, fileType: string }) => generateSignedURL(`${user}/flick/${flickId}/videos/${x.fileName}`, x.fileType)));
            }
            thumbnailSignedUrl = await generateSignedURL(`/user/${user}/flick/${flickId}/thumbnail`);
            if (audioName) {
                const audioPath = `/user/${user}/flick/audio/${flickId}/${audioName}`;
                audioSignedURL = await generateSignedURL(audioPath, audioFileType);
            }
            return handleResponse(res, 200, {
                flickId,
                mediaSignedURL,
                thumbnailSignedUrl,
                audioSignedURL
            });
        }
        return handleResponse(res, 500, errors.unable_to_create_signedURL);
    } catch (error) {
        sendErrorToDiscord("POST:presigned-url-flick", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};