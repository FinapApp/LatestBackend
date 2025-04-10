import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { validateGetHashtags } from "../../validators/validators";
import { HASHTAGS } from "../../models/User/userHashTag.model";
import mongoose from "mongoose";
import { USER } from "../../models/User/user.model";

export const getMentions = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetHashtags(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { search } = req.query
        const checkUsers = await USER.find({ name: { $regex: search, $options: "i" } }, "username photo name");
        if (checkUsers.length > 0) {
            return handleResponse(res, 200, { users: checkUsers })
        }
        return handleResponse(res, 404 , errors.user_not_found);
    } catch (error) {
        sendErrorToDiscord("GET:get-mentions", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};