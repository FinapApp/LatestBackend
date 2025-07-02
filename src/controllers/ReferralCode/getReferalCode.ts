import { Request, Response } from 'express'
import { errors, handleResponse } from '../../utils/responseCodec';
import { REFERRAL } from '../../models/Referral/referral.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getReferalCode = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const referrals = await REFERRAL.find({ user: userId })
            .populate('referredUser', 'username email') // select what you need

        return handleResponse(res, 200, {
            referredUsers: referrals
        });
    } catch (err) {
        sendErrorToDiscord("GET:referred-users", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
