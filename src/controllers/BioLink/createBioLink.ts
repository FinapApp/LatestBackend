import { Request, Response } from 'express'
import { validateCreateBioLink } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import { USERBIOLINKS } from '../../models/User/userBioLinks.model';

export const createBioLink = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateBioLink(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const bioLink  = await USERBIOLINKS.create({
            user: res.locals.userId,
            ...req.body
        });
        if (bioLink) {
            return handleResponse(res, 200, success.create_biolink)
        }
        return handleResponse(res, 500, errors.bio_link_not_created);
    } catch (err) {
        sendErrorToDiscord("POST:create-feedback", err)
        return handleResponse(res, 500, errors.catch_error)
    }
}