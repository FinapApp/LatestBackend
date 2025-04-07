import { Request, Response } from "express"
import Joi from "joi";
import { validateBioLinkId } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USERBIOLINKS } from "../../models/User/userBioLinks";

export const deleteBioLink = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateBioLinkId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const deleteBioLink = await USERBIOLINKS.findByIdAndDelete(req.params.bioLinkId)
        if (deleteBioLink) {
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.delete_biolink)
        }
        return handleResponse(res, 404, errors.bio_link_not_deleted)
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-flick", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}
