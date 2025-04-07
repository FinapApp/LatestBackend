import { Response, Request } from "express";
import { validateUpdateBioLink } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USERBIOLINKS } from "../../models/User/userBioLinks";

export const updateBioLink = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateBioLink(
            req.body, req.params
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        console.log(req.body, "req.body")
        console.log(req.params, "req.params")
        const updateBioLinks = await USERBIOLINKS.findByIdAndUpdate(
            req.params.bioLinkId,
            req.body, { new: true }
        );
        console.log(updateBioLinks, "updateBioLinks")
        if (updateBioLinks) {
            return handleResponse(res, 200, success.update_biolink);
        }
        return handleResponse(res, 403, errors.bio_link_not_updated);
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-flick", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
