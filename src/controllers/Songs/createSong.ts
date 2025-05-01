import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateCreateSong } from "../../validators/validators";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { SONG } from "../../models/Song/song.model";

export const createSong = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateSong(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const song  = await SONG.create(req.body )
        if (song) {
            const songIndex = getIndex("SONGS");
            await songIndex.addDocuments([
                {
                    songId: song._id,
                    ...song.toObject(),
                }
            ])
            return handleResponse(res, 200, success.song_uploaded);
        }
        return handleResponse(res, 404, errors.song_not_uploaded);
    } catch (error: any) {
        if (error.code == 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt)
        }
        sendErrorToDiscord("POST:create-song", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};