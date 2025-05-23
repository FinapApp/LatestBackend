import { Response, Request } from "express";
import { validateUpdateQuest } from "../../../validators/validators";
import { handleResponse, errors, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUESTS } from "../../../models/Quest/quest.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";
import { IMediaSchema } from "../../../models/Flicks/flicks.model";

export const updateQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateQuest(
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
        const user = res.locals.userId;
        const questId = req.params.questId;
        const { coords, ...rest } = req.body;

        if (coords) {
            rest.gps = {
                type: "Point",
                coordinates: [coords.long, coords.lat],
            };
        }
        const updateQuest = await QUESTS.findOneAndUpdate(
            { _id: questId, user },
            { ...rest },
            { new: true }
        );
        if (updateQuest) {
            const questPlain = updateQuest.toObject();
            const { user, media, description, ...restQuest } = questPlain;
            const questIndex = getIndex("QUESTS");
            await questIndex.addDocuments([
                {
                    ...restQuest,
                    questId,
                    thumbnailURLs: media.map((data: IMediaSchema) => data?.thumbnailURL),
                    alts: media.map((media: IMediaSchema) => media?.alt || []).flat(),
                },
            ]);
            return handleResponse(res, 200, success.update_quest);
        }
        return handleResponse(res, 400, errors.update_quest);
    } catch (err: any) {
        console.log(err)
        sendErrorToDiscord("PUT:update-quest", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
