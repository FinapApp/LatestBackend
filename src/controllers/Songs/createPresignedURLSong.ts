import { Request, Response } from 'express'
import { validatePresignedSong } from "../../validators/validators";
import { errors, handleResponse } from "../../utils/responseCodec";
import Joi from "joi";
import { generateSignedURL } from '../../utils/getSignedURL';
import mongoose from 'mongoose';

export const createPresignedURLSong = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validatePresignedSong(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const { fileName } = req.body
        const songId = new mongoose.Types.ObjectId();
        if (songId) {
            const songPath = `${user}/songs/${songId}/${fileName}`;
            const audioSignedURL = await generateSignedURL(songPath);
            return handleResponse(res, 200, {
                songId,
                AUDIOSIGNED: audioSignedURL
            })
        }
        return handleResponse(res, 500, errors.create_songs);
    } catch (err) {
        return handleResponse(res, 500, errors.catch_error)
    }
}