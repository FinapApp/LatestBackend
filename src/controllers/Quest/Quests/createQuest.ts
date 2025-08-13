import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { validateCreateQuest } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";
import { IMediaSchema } from "../../../models/Flicks/flicks.model";
import { WALLET } from "../../../models/Wallet/wallet.model";
import { TRANSACTION } from "../../../models/Wallet/transaction.model";
import { sendNotificationKafka } from "../../../utils/sendNotificationKafka";
export const createQuest = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateQuest(req.body, req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang, validationError.details);
        }

        const userId = res.locals.userId;  // session-derived
        const questId = req.params.questId;
        const { coords, totalAmount, ...rest } = req.body;

        const wallet = await WALLET.findOne({ user: userId }).select("availableBalance promotionalBalance currency");
        if (!wallet) {
            return handleResponse(res, 404, errors.wallet_not_found, lang);
        }
        const combinedBalance = wallet.availableBalance + wallet.promotionalBalance;
        if (combinedBalance < totalAmount) {
            return handleResponse(res, 400, errors.insufficient_balance, lang);
        }
        const quest = await QUESTS.create({
            _id: questId,
            user: userId,
            totalAmount,
            gps: {
                type: "Point",
                coordinates: [coords.long, coords.lat]
            },
            ...rest
        });

        if (!quest) {
            return handleResponse(res, 404, errors.quest_not_found, lang);
        }
        // Deduct the amount from balances
        // Deduct promotional first, then available
        let amountLeftToDeduct = totalAmount;
        let updatedFields: { availableBalance?: number; promotionalBalance?: number } = {};

        if (wallet.promotionalBalance >= amountLeftToDeduct) {
            updatedFields.promotionalBalance = wallet.promotionalBalance - amountLeftToDeduct;
        } else {
            amountLeftToDeduct -= wallet.promotionalBalance;
            updatedFields.promotionalBalance = 0;
            updatedFields.availableBalance = wallet.availableBalance - amountLeftToDeduct;
        }
        await Promise.all([
            WALLET.updateOne({ user: userId }, { $set: updatedFields }),
            TRANSACTION.create({
                user: userId,
                type: "quest",
                amount: totalAmount,
                description: `Quest created with ID ${questId}`,
                quest: questId,
                currency: wallet.currency,
                status: "succeeded",
            })
        ])
        const questIndex = getIndex("QUESTS");
        const userDetails = await quest.populate<{ user: { username: string; photo: string; name: string; _id: string } }>("user", "username photo name");
        const questPlain = quest.toObject();
        const { user, media, ...restQuest } = questPlain;

        await questIndex.addDocuments([{
            ...restQuest,
            totalAmount,
            thumbnailURLs: media.map((m: IMediaSchema) => m?.thumbnailURL),
            alts: media.map((m: IMediaSchema) => m?.alt || []).flat(),
            userId: userDetails.user._id,
            username: userDetails.user.username,
            name: userDetails.user.name,
            photo: userDetails.user.photo,
            questId,
        }]);
        const kafkaMessages = {
            userId,
            metadata: {
                questId,
                title: quest.title,
                description: quest.description,
                thumbnailURL: quest.media[0]?.thumbnailURL || "",
            }   
        }
        sendNotificationKafka('NEW_QUEST', kafkaMessages);
        return handleResponse(res, 200, success.quest_created, lang);
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            return handleResponse(res, 409, errors.quest_already_exists, lang);
        }
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
