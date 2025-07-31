import { Request, Response } from "express";
import { validateLikeToggle } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { LIKE } from "../../models/Likes/likes.model";
import { QUEST_FAV } from "../../models/Quest/questFavorite.model";

interface QueryParams {
    id: string;
    type: 'quest' | 'comment' | 'flick';
}

const buildLikeQuery = (user: string, id: string, type: 'quest' | 'comment' | 'flick') => {
    const query: any = { user };
    if (type === 'flick') query.flick = id;
    if (type === 'comment') query.comment = id;
    if (type === 'quest') query.quest = id;
    return query;
};

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateLikeToggle(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const user = res.locals.userId;
        const { id, type }: QueryParams = req.query as any;

        const query = buildLikeQuery(user, id, type);
        const existingLike = await LIKE.findOne(query);
        // Initialize Redis like count from DB if needed
        if ( type === 'flick') {
            await FLICKS.findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true , projection: { likeCount: 1 } });
        }

        if (type === "quest") {
            const questLike = await QUEST_FAV.findOne({ user, quest: id });
            if (!questLike) {
                await QUEST_FAV.create({ user, quest: id });
            } else {
                await questLike.deleteOne();
            }
        }
        if (existingLike) {
            await existingLike.deleteOne();
        } else {
            await LIKE.create(query);
        }
        return handleResponse(res, 200, success.toggle_like);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
