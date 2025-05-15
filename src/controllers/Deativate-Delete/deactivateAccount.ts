import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";

export const deactivateAccount = async (req: Request, res: Response) => {
    try {
        const { deactivationReason } = req.body;
        if (!deactivationReason) {
            return handleResponse(res, 400, { message: "Deactivation reason is required." });
        }
        const user = await USER.findById(res.locals.userId);
        if (!user) {
            return handleResponse(res, 404, errors.user_not_found);
        }
        user.isDeactivated = true;
        user.deactivationReason = user.deactivationReason || [];
        user.deactivationReason.push(deactivationReason);
        await user.save();
        return handleResponse(res, 200, success.deactivate_account);
    } catch (error: any) {
        if (error.code === 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt);
        }
        sendErrorToDiscord("POST:deactivate-account", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
