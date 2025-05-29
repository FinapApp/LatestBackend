import { Response, Request } from "express";
import { validateUpdateFlick } from "../../validators/validators";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FLICKS, IMediaSchema } from "../../models/Flicks/flicks.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { HASHTAGS } from "../../models/User/userHashTag.model";

export const updateFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateFlick(
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
        const { newHashTags, ...rest } = req.body;
        if (newHashTags) {
            const createHashTags = await HASHTAGS.insertMany(newHashTags.map((tag: { id: string, value: string }) => ({ value: tag.value, _id: tag.id })));
            const hashTagIndex = getIndex("HASHTAG");
            await hashTagIndex.addDocuments(newHashTags.map((tag: { id: string, value: string }) => ({ hashtagId: tag.id, value: tag.value , count : 1 })));
            if (!createHashTags) {
                return handleResponse(res, 404, errors.create_hashtags);
            }
        }
        const flickId = req.params.flickId;
        const userId = res.locals.userId;
        const updateFlick = await FLICKS.findOneAndUpdate(
            {_id : flickId , user : userId},
            rest,
            { new: true }
        );
        if (updateFlick) {
            const flickPlain = updateFlick.toObject();
            const { user, media, description, ...restFlick } = flickPlain;
            const flickIndex = getIndex("FLICKS");
            await flickIndex.addDocuments([
                {
                    ...restFlick,
                    media,
                    descriptionText: description.map((text) => text.text),
                    taggedUsers: media.map((media: IMediaSchema) => media?.taggedUsers?.map(taggedUser => taggedUser.text) || []).flat(),
                    alts: media.map((media: IMediaSchema) => media?.alt || []).flat(),
                    flickId,
                }
            ])
            return handleResponse(res, 200, success.flick_updated);
        }
        return handleResponse(res, 304, errors.flick_updated);
    } catch (err: any) {
        console.error("Error updating flick:", err);
        sendErrorToDiscord("PUT:update-flick", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
