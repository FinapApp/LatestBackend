import { Request, Response } from 'express'
import { validateCreateBioLink } from "../../validators/validators";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import { USERBIOLINKS } from '../../models/User/userBioLinks.model';

export const createBioLink = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateBioLink(req.body, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }
        const bioLink  = await USERBIOLINKS.create({
            user: res.locals.userId,
            ...req.body
        });
        if (bioLink) {
            return handleResponse(res, 200, success.create_biolink, lang);
        }
        return handleResponse(res, 500, errors.bio_link_not_created, lang);
    } catch (err) {
        sendErrorToDiscord("POST:create-feedback", err)
        return handleResponse(res, 500, errors.catch_error, lang);
    }
}