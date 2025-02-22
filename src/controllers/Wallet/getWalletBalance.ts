import { WALLET } from "../../models/Wallet/wallet.model"
import { errors, handleResponse } from "../../utils/responseCodec"
import { Request, Response } from "express"

export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const checkBalance = await WALLET.findOneAndUpdate(
            { userId: res.locals.userId },
            { $setOnInsert: { userId: res.locals.userId, balance: 0 } },
            { upsert: true, new: true }  
        );
        if (checkBalance ) {
            return handleResponse(res, 200, { balance: checkBalance.balance })
        }
        return handleResponse(res, 304, { message: 'No balance found' })
    } catch (error) {
        console.log(error)
     return handleResponse(res, 500, errors.catch_error)
    }
}