import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateCreateSong } from "../../validators/validators";
import { SONG } from "../../models/Song/song.model";

export const createSong = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateSong(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const songId = req.params.songId;
        const song = await SONG.create({
            _id  : songId,
            user,
            ...req.body 
        });
        if (!song) {
            return handleResponse(res, 404, errors.song_not_found);
        }
        return handleResponse(res, 200, success.song_uploaded);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};