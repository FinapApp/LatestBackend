import { Response, Request } from "express";
import { validateRepostFlick, } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS, IMediaSchema } from "../../models/Flicks/flicks.model";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { USER } from "../../models/User/user.model";
import { HASHTAGS } from "../../models/User/userHashTag.model";

export const repostFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateRepostFlick(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { flickId } = req.params;
        const { taggedUsers = [], description, newHashTags , ...rest } = req.body;
        const userId = res.locals.userId;

        const originalFlick = await FLICKS.findById(flickId).select("user media thumbnailURL quest song songStart songEnd repostVisible");
        if (!originalFlick) {
            return handleResponse(res, 404, errors.flick_not_found);
        }


        const isOwner = String(originalFlick.user) === userId;

        if (!originalFlick.repostVisible && !isOwner) {
            return handleResponse(res, 403, errors.permission_denied);
        }

        const hashTagIndex = getIndex("HASHTAG");
        if (newHashTags) {
            const createHashTags = await HASHTAGS.insertMany(newHashTags.map((tag: { id: string, value: string }) => ({ value: tag.value, _id: tag.id })));
            await hashTagIndex.addDocuments(newHashTags.map((tag: { id: string, value: string }) => ({ hashtagId: tag.id, value: tag.value, count: 1 })));
            if (!createHashTags) {
                return handleResponse(res, 404, errors.create_hashtags);
            }
        }
        const allDescriptionHashtagIds = (description || [])
            .map((desc: { hashtag: string }) => desc.hashtag)
            .filter((id: string): id is string => !!id);
        const newHashTagIds = (newHashTags || []).map((tag: { id: string }) => tag.id);
        const oldHashTagIds = allDescriptionHashtagIds.filter((id: string) => !newHashTagIds.includes(id));
        if (oldHashTagIds.length > 0) {
            // 1. Update count in MongoDB
            await HASHTAGS.updateMany(
                { _id: { $in: oldHashTagIds } },
                { $inc: { count: 1 } }
            ).catch(err => sendErrorToDiscord("POST:repost-flick:increment-old-hashtag-count", err));

            // 2. Fetch updated hashtags from MongoDB
            const updatedHashtags = await HASHTAGS.find({ _id: { $in: oldHashTagIds } })
                .select("_id value count") as Array<{ _id: string; value: string; count: number }>;
            // 3. Push updated hashtags to Meilisearch
            await hashTagIndex.addDocuments(
                updatedHashtags.map(tag => ({
                    hashtagId: tag._id.toString(),
                    value: tag.value,
                    count: tag.count
                }))
            );
        }
        const updatedMedia = originalFlick.media.map((mediaItem, index) => {
            const tags = taggedUsers?.[index];
            return {
                ...mediaItem,
                taggedUsers: Array.isArray(tags) ? tags : (tags ? [tags] : [])
            };
        });
        const repostedFlick = await FLICKS.create({
            user: userId,
            repost: flickId,
            media: updatedMedia,
            description: description || [],
            thumbnailURL: originalFlick.thumbnailURL,
            quest: originalFlick.quest,
            song: originalFlick.song,
            songStart: originalFlick.songStart,
            songEnd: originalFlick.songEnd,
            ...rest
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
                FLICKS.findByIdAndUpdate(flickId, { $inc: { repostCount: 1 } }, { new: true })
                    .catch(err => sendErrorToDiscord("POST:repost-flick:repostCount", err))
            ]);

            return handleResponse(res, 200, success.flick_reposted);
        }

        return handleResponse(res, 500, errors.flick_not_found);
    } catch (err: any) {
        console.log(err);
        sendErrorToDiscord("POST:repost-flick", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
