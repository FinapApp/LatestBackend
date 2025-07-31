import { Request, Response } from "express";
import { validateLikeToggle } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { LIKE } from "../../models/Likes/likes.model";
import { QUEST_FAV } from "../../models/Quest/questFavorite.model";
import mongoose from "mongoose";
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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const validationError: Joi.ValidationError | undefined = validateLikeToggle(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId;
        const { id, type }: QueryParams = req.query as any;
        const query = buildLikeQuery(user, id, type);
        // Find Like document (atomic check)
        const existingLike = await LIKE.findOne(query).session(session);
        // Flick logic: Use $inc for atomic likeCount update
        if (type === "flick") {
            const flick = await FLICKS.findById(id).session(session);
            if (!flick) {
                await session.abortTransaction();
                return handleResponse(res, 404, errors.flick_not_found);
            }
            const inc = existingLike ? -1 : 1;
            await FLICKS.updateOne({ _id: id }, { $inc: { likeCount: inc } }).session(session);
        }
        // Quest Favorite: Upsert logic
        if (type === "quest") {
            const fav = await QUEST_FAV.findOne({ user, quest: id }).session(session);
            if (!fav) {
                await QUEST_FAV.create([{ user, quest: id }], { session });
            } else {
                await fav.deleteOne({ session });
            }
        }
        // Toggle Like document itself
        if (existingLike) {
            await existingLike.deleteOne({ session });
        } else {
            await LIKE.create([{ ...query }], { session });
        }
        await session.commitTransaction();
        session.endSession();
        return handleResponse(res, 200, success.toggle_like);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
}