import { Response, Request } from "express";
import { validateUpdateBioLink } from "../../validators/validators";
import { handleResponse, errors, success, Lang } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USERBIOLINKS } from "../../models/User/userBioLinks.model";

export const updateBioLink = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateBioLink(
            req.body, req.params , req.query
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                'en',
                validationError.details
            );
        }
        const updateBioLinks = await USERBIOLINKS.findOneAndUpdate(
            { _id: req.params.bioLinkId, user: res.locals.userId },
            req.body, { new: true }
        );
        if (updateBioLinks) {
            return handleResponse(res, 200, success.update_biolink , lang);
        }
        return handleResponse(res, 403, errors.bio_link_not_updated, lang);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-flick", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
