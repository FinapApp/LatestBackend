import { Request, Response } from "express";
import { errors, handleResponse, Lang } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import mongoose from "mongoose";
import { validatePresignedQuestApplication } from "../../../validators/validators";
import { generateSignedURL } from "../../../utils/s3.utils";

export const createPresignedURLQuestApplication = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang|| 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validatePresignedQuestApplication(req.body , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const user = res.locals.userId;
        const questApplicantId = new mongoose.Types.ObjectId();
        if (!questApplicantId) {
            return handleResponse(res, 404, errors.quest_not_found, lang);
        }
        const mediaSignedURL = await Promise.all(req.body.media.map((x: { fileName: string, fileType: string }) => generateSignedURL(`${user}/quest-applicant/${questApplicantId}/${x.fileName}`, x.fileType)));
        const thumbnailSignedURL = await Promise.all(req.body.media.map((x: { fileName: string, fileType: string }) => generateSignedURL(`${user}/quest-applicant/${questApplicantId}/thumbnail/${x.fileName.split(".")[0]}.jpeg`)));
        if (mediaSignedURL && thumbnailSignedURL) {
            return handleResponse(res, 200, {
                questApplicantId,
                mediaSignedURL,
                thumbnailSignedURL
            });
        }
        return handleResponse(res, 500, errors.unable_to_create_signedURL, lang);
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("confirm-quest-applicant-upload", error)
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
