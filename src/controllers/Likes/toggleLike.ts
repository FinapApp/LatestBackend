import { Request, Response } from "express";
import { validateLikeToggle } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { LIKE } from "../../models/Likes/likes.model";
import { QUEST_FAV } from "../../models/Quest/questFavorite.model";
import mongoose from "mongoose";
import { sendNotificationKafka } from "../../utils/sendNotificationKafka";
import { QUESTS } from "../../models/Quest/quest.model";

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
            await session.abortTransaction();
            session.endSession();
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const user = res.locals.userId;
        const username = res.locals.username;
        const { id, type }: QueryParams = req.query as any;

        const query = buildLikeQuery(user, id, type);

        let searched: any = null;

        // Quest logic - fix: replaced aggregate with findById for real Mongoose doc
        if (type === "quest") {
            searched = await QUESTS.findById(id, "user likeCount media").session(session);
            if (!searched) {
                await session.abortTransaction();
                session.endSession();
                return handleResponse(res, 404, errors.quest_not_found);
            }

            const fav = await QUEST_FAV.findOne({ user, quest: id }).session(session);
            if (!fav) {
                // increment likeCount by 1
                await searched.updateOne({ $inc: { likeCount: 1 } }, { session });
                await QUEST_FAV.create([{ user, quest: id }], { session });
            } else {
                // decrement likeCount by 1
                await searched.updateOne({ $inc: { likeCount: -1 } }, { session });
                await fav.deleteOne({ session });
            }
        }

        // Check if LIKE document exists
        const existingLike = await LIKE.findOne(query).session(session);

        // Flick logic
        if (type === "flick") {
            searched = await FLICKS.findById(id, "user thumbnailURL likeCount").session(session);
            if (!searched) {
                await session.abortTransaction();
                session.endSession();
                return handleResponse(res, 404, errors.flick_not_found);
            }

            const inc = existingLike ? -1 : 1;
            await FLICKS.updateOne({ _id: id }, { $inc: { likeCount: inc } }).session(session);
        }

        // Comment logic (optional placeholder if needed)
        // you can add comment like toggle similarly here

        // Toggle the LIKE document itself
        if (existingLike) {
            await existingLike.deleteOne({ session });
        } else {
            await LIKE.create([{ ...query }], { session });
        }

        await session.commitTransaction();
        session.endSession();

        // Prepare notification, only notify if liked/unliked by other user
        if (searched && searched.user.toString() !== user) {
            const kafkaMessage = {
                userId: user,
                contentUserId: searched.user,
                username,
                targetId: id,
                likeCount: (searched.likeCount || 0) + (existingLike ? -1 : 1), // updated count correctly
                photo: (searched.thumbnailURL || (searched.media && searched.media.length > 0 && searched.media[0].thumbnailURL)) || null,
                targetType: type,
                action: existingLike ? "unliked" : "liked",
                timestamp: new Date().toISOString(),
            };

            sendNotificationKafka('LIKE_TOGGLE', kafkaMessage).catch(err => {
                console.error("Kafka notification error in toggleLike:", err);
            });
        }

        return handleResponse(res, 200, success.toggle_like);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
