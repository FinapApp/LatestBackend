import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { validateCreateQuest } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";
import { IMediaSchema } from "../../../models/Flicks/flicks.model";

export const createQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateQuest(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const userId = res.locals.userId
        const questId = req.params.questId;
        const { coords, ...rest } = req.body;
        const quest = await QUESTS.create({
            _id: questId,
            user: userId,
            gps: {
                type: "Point",
                coordinates: [coords.long, coords.lat]
            },
            ...rest
        });
        if (quest) {
            const questIndex = getIndex("QUESTS");
            const userDetails = await quest.populate<{ user: { username: string; photo: string; name: string, _id: string } }>("user", "username photo name");
            const questPlain = quest.toObject();
            const { user, media,  ...restQuest } = questPlain;
            await questIndex.addDocuments([{
                ...restQuest,
                thumbnailURLs: media.map((data : IMediaSchema) => data?.thumbnailURL),
                alts: media.map((media: IMediaSchema) => media?.alt || []).flat(),
                userId: userDetails.user._id,
                username: userDetails.user.username,
                name: userDetails.user.name,
                photo: userDetails.user.photo,
                questId,
            }]);
            return handleResponse(res, 200, success.quest_created);
        }
        return handleResponse(res, 404, errors.quest_not_found);
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            return handleResponse(res, 409, errors.quest_already_exists);
        }
        return handleResponse(res, 500, errors.catch_error);
    }
};