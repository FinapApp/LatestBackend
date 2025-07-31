import { Request, Response } from "express";
import { FLICKS, IMediaSchema } from "../../models/Flicks/flicks.model";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { validateCreateFlick } from "../../validators/validators";
import { AUDIO } from "../../models/Audio/audio.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { HASHTAGS } from "../../models/User/userHashTag.model";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { USER } from "../../models/User/user.model";

export const createFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFlick(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId
        const flickId = req.params.flickId;
        const { audio, audioName, newHashTags, description, ...rest } = req.body;
        let checkAudio;
        if (audio) {
            checkAudio = await AUDIO.create({ url: audio, name: audioName });
            if (!checkAudio) {
                return handleResponse(res, 404, errors.create_audio);
            }
        }
        // EVERYTIME I MAKE A NEWHASHTAG ID STORED I WANT THE ID TO BE THE SAME AS THE ID IN THE DATABASE
        // YOU GET THOSE IDS IF YOU DONT GET THE DESIRED RESULT I RETURN YOU WITH A ID FOR THE SEARCHED ELEMENT WHEN YOU'RE SURE ENOUGH WE JUST DO IT LIKE  THAT.
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
            ).catch(err => sendErrorToDiscord("POST:create-flick:increment-old-hashtag-count", err));

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
        const flick = await FLICKS.create(
            {
                _id: flickId,
                audio: checkAudio?._id as any,
                description,
                user,
                ...rest
            }
        )
        if (flick) {
            const flickIndex = getIndex("FLICKS");
            const userDetails = await flick.populate<{ user: { username: string; photo: string; name: string, _id: string, } }>("user", "username photo name");
            const flickPlain = flick.toObject();
            const { user, media, description, ...restFlick } = flickPlain;
            await flickIndex.addDocuments([
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
            ]);
            USER.findByIdAndUpdate(user, { $inc: { flickCount: 1 } }, { new: true })
                .catch(err => sendErrorToDiscord("POST:create-flick:flickCount", err));
            return handleResponse(res, 200, success.flick_uploaded);
        }
        return handleResponse(res, 404, errors.flick_not_found);
    } catch (error: any) {
        console.log(error);
        if (error.code == 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt)
        }
        sendErrorToDiscord("POST:create-flick", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};