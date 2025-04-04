import { Request, Response } from 'express'
import { validateGetAllFlicks } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { FLICKS } from '../../models/Flicks/flicks.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getAllTaggedFlicks = async (req: Request, res: Response) => {
    try {
        //  IT IS OF THE HOME PAGE
        const validationError: Joi.ValidationError | undefined = validateGetAllFlicks(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        // const user = res.locals.userId

        //FOR TESTING THEIR OWN FLICKS  // REMOVE WHEN AGGREGATION IS BEING DONE
        const taggedFlicks = await FLICKS.find({ 'media.taggedUser.user' : res.locals.userId },)

        if (!taggedFlicks) {
            return handleResponse(res, 304, errors.no_flicks)
        }
        return handleResponse(res, 200, { taggedFlicks })
    } catch (error) {
        sendErrorToDiscord("GET:get-all-tagged-flicks", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}