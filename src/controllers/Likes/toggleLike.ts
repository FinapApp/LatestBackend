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
import { sendNotificationKafka } from "../../utils/sendNotificationKafka"; // example import
import { QUESTS } from "../../models/Quest/quest.model";

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
        let searched: any = null;
        // Quest Favorite: Upsert logic
        if (type === "quest") {
            const searchedArr = await QUESTS.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $project: {
                        user: 1,
                        likeCount: 1,
                        thumbnailURL: { $arrayElemAt: ["$media.thumbnailURL", 0] }
                    }
                }
            ]).session(session).exec();

            if (!searchedArr || searchedArr.length === 0) {
                await session.abortTransaction();
                return handleResponse(res, 404, errors.quest_not_found);
            }
            searched = searchedArr[0];
            if (!searched) {
                await session.abortTransaction();
                return handleResponse(res, 404, errors.quest_not_found);
            }
            const fav = await QUEST_FAV.findOne({ user, quest: id }).session(session);
            if (!fav) {
                await searched.updateOne({ $inc: { likeCount: 1 } }, { session });
                await QUEST_FAV.create([{ user, quest: id }], { session });
            } else {
                await searched.updateOne({ $inc: { likeCount: -1 } }, { session });
                await fav.deleteOne({ session });
            }
        }

        const existingLike = await LIKE.findOne(query).session(session);

        // Flick logic: Use $inc for atomic likeCount update
        if (type === "flick") {
            searched = await FLICKS.findById(id, "user thumbnailURL likeCount").session(session);
            if (!searched) {
                await session.abortTransaction();
                return handleResponse(res, 404, errors.flick_not_found);
            }
            const inc = existingLike ? -1 : 1;
            await FLICKS.updateOne({ _id: id }, { $inc: { likeCount: inc } }).session(session);
        }
        // Toggle Like document itself
        if (existingLike) {
            await existingLike.deleteOne({ session });
        } else {
            await LIKE.create([{ ...query }], { session });
        }

        await session.commitTransaction();
        session.endSession();

        if (searched.user !== user) {  // Don't send notification to self
            const kafkaMessage = {
                userId: user,
                contentUserId: searched.user,
                username: res.locals.username,
                targetId: id,
                likeCount  : searched.likeCount,
                photo: searched.thumbnailURL,
                targetType: type,
                action: existingLike ? "unliked" : "liked",
                timestamp: new Date().toISOString()
            };
            // Send Kafka notification asynchronously, don't await so it doesn't delay response
            await sendNotificationKafka('LIKE_TOGGLE', kafkaMessage).catch((err) => {
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
