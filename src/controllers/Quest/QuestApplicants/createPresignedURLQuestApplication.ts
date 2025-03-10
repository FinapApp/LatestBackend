import { Request, Response } from "express";
import { errors, handleResponse} from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import mongoose from "mongoose";
import { validatePresignedQuestApplication  } from "../../../validators/validators";
import { generateSignedURL } from "../../../utils/getSignedURL";

export const createPresignedURLQuestApplication = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePresignedQuestApplication(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId;
        const questApplicantId = new mongoose.Types.ObjectId();
        if (!questApplicantId) {
            return handleResponse(res, 404, errors.quest_not_found);
        }
        const mediaPresignedURLs = await Promise.all(req.body.media.map((fileName: string, fileType : string) => generateSignedURL(`${user}/quest-applicant/${questApplicantId}/${fileName}` , fileType)));
        return handleResponse(res, 200, {
            questApplicantId,
            MEDIASIGNED: mediaPresignedURLs
        })
    } catch (error) {
        sendErrorToDiscord("confirm-quest-applicant-upload", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};


