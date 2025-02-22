import { Request, Response } from 'express'
import { validatePresignedQuest } from "../../../validators/validators";
import { errors, handleResponse } from "../../../utils/responseCodec";
import Joi from "joi";
import { generateSignedURL } from '../../../utils/getSignedURL';
import mongoose from 'mongoose';

export const createPresignedURLQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePresignedQuest(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const questId = new mongoose.Types.ObjectId();
        if (questId) {
            const mediaPresignedURLs = await Promise.all(req.body.media.map((fileName: string) => generateSignedURL(`${user}/quest/${questId}/${fileName}`)));
            return handleResponse(res, 200, {
                questId,
                MEDIASIGNED: mediaPresignedURLs
            })
        }
        return handleResponse(res, 404, errors.create_quest);
    } catch (err) {
        return handleResponse(res, 500, errors.catch_error)
    }
}