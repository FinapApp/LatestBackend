import { Request, Response } from "express";
import { validatePresignedURLReport, validatePresinedURLQuest } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
import { generateSignedURL } from "../../utils/getSignedURL";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import mongoose from "mongoose";

export const createPresignedURLReport = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePresignedURLReport(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        // Extract metadata without media URLs
        const { attachment } = req.body;
        const reportId = new mongoose.Types.ObjectId();
        const userId = res.locals.userId as string;
        // Create reel document without media URLs
        if (reportId) {
            const ATTACHMENTPRESIGNEDURL = await Promise.all(attachment.map((metadata: {
                fileName: string;
                fileType: string;
            }) => generateSignedURL(`user/${userId}/report/${reportId}/${metadata.fileName}`, metadata.fileType)));
            if (ATTACHMENTPRESIGNEDURL) {
                return handleResponse(res, 200, {
                    reportId,
                    ATTACHMENTPRESIGNEDURL
                });
            }
        }
        
        return handleResponse(res, 500, errors.unable_to_create_signedURL);
    } catch (error) {
        sendErrorToDiscord("create-flicks", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};