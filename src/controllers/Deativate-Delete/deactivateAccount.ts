import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { validateDeactivateAccount } from "../../validators/validators";
import Joi from "joi";

export const deactivateAccount = async (req: Request, res: Response) => {
    try {

        const validationError: Joi.ValidationError | undefined = validateDeactivateAccount(
            req.body
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
        const { deactivationReason } = req.body;
        const userId = res.locals.userId;

        // Atomically push reason & mark as deactivated
        const updatedUser = await USER.findByIdAndUpdate(
            userId,
            {
                $set: { isDeactivated: true },
                $push: { deactivationReason }
            },
            { new: true }
        );

        if (updatedUser) {
            // ✅ Sync with Meilisearch
            const userIndex = getIndex("USERS");
            await userIndex.addDocuments([
                {
                    userId,
                    ...updatedUser.toObject()
                }
            ]);

            return handleResponse(res, 200, success.deactivate_account);
        }
        return handleResponse(res, 404, errors.user_not_found);
    } catch (err: any) {
        if (err.code === 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt);
        }
        sendErrorToDiscord("POST:deactivate-account", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
