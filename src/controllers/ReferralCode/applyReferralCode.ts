import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { validateApplyReferralCode } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import { REFERRAL } from '../../models/Referral/referral.model';
import { WALLET } from '../../models/Wallet/wallet.model';
import { config } from '../../config/generalconfig';

export const applyReferralCode = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate input
        const validationError: Joi.ValidationError | undefined = validateApplyReferralCode(req.body);
        if (validationError) {
            await session.abortTransaction();
            session.endSession();
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { code } = req.body;
        const newUserId = res.locals.userId;

        // Check if referral code exists
        const referrerEntry = await REFERRAL.findOne({ code }).session(session);
        if (!referrerEntry) {
            await session.abortTransaction();
            session.endSession();
            return handleResponse(res, 404, errors.referral_code_not_found);
        }

        // Prevent self-referral
        if (referrerEntry.user.toString() === newUserId.toString()) {
            await session.abortTransaction();
            session.endSession();
            return handleResponse(res, 400, errors.cannot_use_own_referral_code);
        }

        // Check if user already used a referral
        const alreadyUsed = await REFERRAL.findOne({ referredUser: newUserId }).session(session);
        if (alreadyUsed) {
            await session.abortTransaction();
            session.endSession();
            return handleResponse(res, 400, errors.referral_code_not_found);
        }

        // Update referredUsers[] in the referrer’s referral doc
        await REFERRAL.updateOne(
            { user: referrerEntry.user },
            { $addToSet: { referredUsers: newUserId } },
            { session }
        );

        // Wallet reward logic
        await WALLET.bulkWrite([
            {
                updateOne: {
                    filter: { user: referrerEntry.user },
                    update: { $inc: { promotionalBalance: config.REFERRAL.referrerReward } },
                    upsert: true,
                },
            },
            {
                updateOne: {
                    filter: { user: newUserId },
                    update: { $inc: { promotionalBalance: config.REFERRAL.referredUserReward } },
                    upsert: true,
                },
            }
        ], { session });

        await session.commitTransaction();
        session.endSession();
        return handleResponse(res, 200, success.referral_code_applied);

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        sendErrorToDiscord("POST:apply-referral", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
