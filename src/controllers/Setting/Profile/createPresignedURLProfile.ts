import { Request, Response } from 'express'
import { validatePresignedProfile } from "../../../validators/validators";
import { errors, handleResponse } from "../../../utils/responseCodec";
import Joi from "joi";
import { generateSignedURL } from '../../../utils/getSignedURL';
import mongoose from 'mongoose';
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';

export const createPresignedURLProfile = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePresignedProfile(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const userId = res.locals.userId
        const {  fileType } = req.body
        const songId = new mongoose.Types.ObjectId();
        if (songId) {
            const profileImagePath = `user/${userId}/profile-image`;
            const profileSignedURL = await generateSignedURL(profileImagePath, fileType);
            return handleResponse(res, 200, {
                profileSignedURL
            })
        }
        return handleResponse(res, 500, errors.create_songs);
    } catch (err) {
        sendErrorToDiscord("POST:presigned-url-profile", err)
        return handleResponse(res, 500, errors.catch_error)
    }
}