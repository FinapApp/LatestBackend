import { Request, Response } from "express";
import { errors, handleResponse, } from "../../../utils/responseCodec";
import { USERPREFERENCE } from "../../../models/User/userPreference.model";

export const getTwoFactorAuth = async (req: Request, res: Response) => {
    try {
        const user = res.locals.userId
        const getTwoFactorAuth = await USERPREFERENCE.findById(user, "twoFactorMethod twoFactor -_id")
        if (getTwoFactorAuth) {
            return handleResponse(res, 200, { twoFactor: getTwoFactorAuth.twoFactor, twoFactorMethod : getTwoFactorAuth.twoFactorMethod });
        }
        return handleResponse(res, 400, errors.get_two_factor);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};