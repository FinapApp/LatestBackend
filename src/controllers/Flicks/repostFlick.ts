import { Response, Request } from "express";
import { validateRepostFlick, } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS, IMediaSchema } from "../../models/Flicks/flicks.model";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { USER } from "../../models/User/user.model";

export const repostFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateRepostFlick(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { flickId } = req.params;
        const {
            taggedUsers = [],
            description,
            location,
            commentVisible,
            likeVisible
        } = req.body;
        const originalFlick = await FLICKS.findById(flickId, "media");
        if (!originalFlick) {
            return handleResponse(res, 404, errors.flick_not_found);
        }
        const updatedMedia = originalFlick.media.map((originalMedia, index) => ({
            ...originalMedia.toObject(),
            taggedUsers: taggedUsers[index] || []
        }));
        const repostedFlick = await FLICKS.create({
            user: res.locals.userId, 
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
        if (repostedFlick) {
            const flickIndex = getIndex("FLICKS");
            const userDetails = await repostedFlick.populate<{ user: { username: string; photo: string; name: string, _id: string } }>("user", "username photo name");
            const flickPlain = repostedFlick.toObject();
            const { user, media, description, ...restFlick } = flickPlain;
            await Promise.all([
                flickIndex.addDocuments([
                    {
                        ...restFlick,
                        media,
                        descriptionText: description.map((text) => text.text),
                        taggedUsers: media.map((media: IMediaSchema) => media?.taggedUsers?.map(taggedUser => taggedUser.text) || []).flat(),
                        alts: media.map((media: IMediaSchema) => media?.alt || []).flat(),
                        userId: userDetails.user._id,
                        username: userDetails.user.username,
                        name: userDetails.user.name,
                        photo: userDetails.user.photo,
                        flickId,
                    }
                ]),
                USER.findByIdAndUpdate(user, { $inc: { flickCount: 1 } }, { new: true })
                    .catch(err => sendErrorToDiscord("POST:repost-flick:flickCount", err)),
                FLICKS.findByIdAndUpdate(flickId, { $inc: { repostCount: 1 } }, { new: true }).catch(err => sendErrorToDiscord("POST:repost-flick:repostCount", err))
            ])
            return handleResponse(res, 200, success.flick_reposted);
        }
        return handleResponse(res, 500, errors.flick_not_found);
    } catch (err: any) {
        console.log(err)
        sendErrorToDiscord("POST:repost-flick", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
