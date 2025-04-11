import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { validateGetHashtags } from "../../validators/validators";
import { HASHTAGS } from "../../models/User/userHashTag.model";
import mongoose from "mongoose";

export const getHashTag = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetHashtags(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { search } = req.query
        const checkHashTags = await HASHTAGS.find({ value: { $regex: search, $options: "i" } }, "value");
        const hashTagId = new mongoose.Types.ObjectId
        if (checkHashTags.length > 0) {
            return handleResponse(res, 200, { hashTagId , hashTags: checkHashTags })
        }
        return handleResponse(res, 200, {
            newHashTagId: hashTagId
        });
    } catch (error) {
        sendErrorToDiscord("GET:get-hash-ids", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};