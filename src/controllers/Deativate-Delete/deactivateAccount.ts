import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { validateDeactivateAccount } from "../../validators/validators";
import Joi from "joi";
import bcrypt from "bcryptjs";


export const deactivateAccount = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateDeactivateAccount(req.body , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const { deactivationReason, password } = req.body;
        const userId = res.locals.userId;
        const user = await USER.findById(userId);
        if (!user) {
            return handleResponse(res, 404, errors.user_not_found , lang);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleResponse(res, 400, errors.incorrect_password , lang);
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
        return handleResponse(res, 200, success.deactivate_account, lang);
    } catch (err: any) {
        if (err.code === 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt, lang);
        }
        sendErrorToDiscord("POST:deactivate-account", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
