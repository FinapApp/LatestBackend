import { Request, Response } from "express";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateCreateFlick } from "../../validators/validators";
import { AUDIO } from "../../models/Audio/audio.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const createFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFlick(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const flickId = req.params.flickId;
        const { audio, audioName, ...rest } = req.body;
        let checkAudio;
        if (audio) {
            checkAudio = await AUDIO.create({ url: audio, name: audioName });
            if (!checkAudio) {
                return handleResponse(res, 404, errors.create_audio);
            }
        }
        const flick = await FLICKS.create(
            {
                _id: flickId,
                audio: checkAudio?._id as any,
                user,
                ...rest
            }
        );
        if (!flick) {
            return handleResponse(res, 404, errors.flick_not_found);
        }
        return handleResponse(res, 200, success.flick_uploaded);
    } catch (error : any) {
        if(error.code  == 11000){
            return handleResponse(res, 500, errors.cannot_rerunIt)
        }
        sendErrorToDiscord("POST:create-flick", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};