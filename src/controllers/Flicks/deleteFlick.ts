import { Request, Response } from "express"
import Joi from "joi";
import { validateFlickId } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { USER } from "../../models/User/user.model";

export const deleteFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFlickId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const deleteFlick = await FLICKS.findOneAndDelete({ _id: req.params.flickId, user })
        if (deleteFlick) {
            const flickIndex = getIndex("FLICKS");
            await flickIndex.deleteDocument(req.params.flickId)
            USER.findByIdAndUpdate(user, { $inc: { flickCount: -1 } }, { new: true })
                .catch(err => sendErrorToDiscord("DELETE:delete-flick:flickCount", err));
            // if we delete the reel we need to delete the associated likes , comments on it as well , in case of notifing it we can do that as well.
            return handleResponse(res, 200, success.flick_deleted)
        }
        return handleResponse(res, 404, errors.flick_deleted)
    } catch (error) {
        sendErrorToDiscord("DELETE:delete-flick", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}
