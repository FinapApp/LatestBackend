import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { validateDeactivateAccount } from "../../validators/validators";
import Joi from "joi";
import bcrypt from "bcryptjs";


export const deactivateAccount = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateDeactivateAccount(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { deactivationReason, password } = req.body;
        const userId = res.locals.userId;
        const user = await USER.findById(userId);
        if (!user) {
            return handleResponse(res, 404, errors.user_not_found);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleResponse(res, 400, errors.incorrect_password);
        }
        user.isDeactivated = true;
        if (!Array.isArray(user.deactivationReason)) {
            user.deactivationReason = [];
        }
        user.deactivationReason.push(deactivationReason);
        await user.save();
        const userIndex = getIndex("USERS");
        await userIndex.addDocuments([
            {
                userId,
                ...user.toObject()
            }
        ]);
        return handleResponse(res, 200, success.deactivate_account);
    } catch (err: any) {
        if (err.code === 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt);
        }
        sendErrorToDiscord("POST:deactivate-account", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
