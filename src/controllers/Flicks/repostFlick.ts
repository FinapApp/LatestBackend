import { Response, Request } from "express";
import { validateRepostFlick, } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS } from "../../models/Flicks/flicks.model";
export const repostFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateRepostFlick(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { flickId } = req.params;
        const {
            media: incomingMedia,
            description,
            location,
            commentVisible,
            likeVisible
        } = req.body;

        const originalFlick = await FLICKS.findById(flickId);
        if (!originalFlick) {
            return handleResponse(res, 404, errors.flick_not_found);
        }

        // Construct repost media: keep structure, override taggedUsers
        const updatedMedia = originalFlick.media.map((originalMedia, index) => {
            const newTaggedUsers = incomingMedia[index]?.taggedUsers || [];
            return {
                ...originalMedia.toObject(),
                taggedUsers: newTaggedUsers,
            };
        });

        const repostedFlick = await FLICKS.create({
            user: res.locals.userId, // keep original author
            repost: flickId,
            media: updatedMedia,
            thumbnailURL: originalFlick.thumbnailURL,
            quest: originalFlick.quest,
            song: originalFlick.song,
            songStart: originalFlick.songStart,
            songEnd: originalFlick.songEnd,
            description,
            location,
            commentVisible,
            likeVisible,
        });

        if (!repostedFlick) {
            return handleResponse(res, 500, errors.flick_not_found);
        }

        // Increment repost count
        await FLICKS.findByIdAndUpdate(flickId, { $inc: { repostCount: 1 } });

        return handleResponse(res, 200, success.flick_reposted);
    } catch (err: any) {
        sendErrorToDiscord("POST:repost-flick", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
