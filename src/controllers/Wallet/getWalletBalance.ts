import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { WALLET } from "../../models/Wallet/wallet.model"
import { errors, handleResponse } from "../../utils/responseCodec"
import { Request, Response } from "express"

export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const checkBalance = await WALLET.findOneAndUpdate(
            { user: res.locals.userId },
            { $setOnInsert: { user: res.locals.userId, balance: 0 } },
            { upsert: true, new: true }
        );
        if (checkBalance) {
            return handleResponse(res, 200, { balance: checkBalance.balance })
        }
        return handleResponse(res, 304, { message: 'No balance found' })
    } catch (error) {
        sendErrorToDiscord("GET:wallet-balance", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}