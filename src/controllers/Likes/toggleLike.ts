import { Request, Response } from "express";
import { validateLike } from "../../validators/validators";
import Joi from "joi";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { LIKE, } from "../../models/Likes/likes.model";

export const toggleLike = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateLike(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const user = res.locals.userId;
        const like = await LIKE.findOneAndUpdate(
            { $or: [{ user: user, flick: req.body.flick }, { comment: req.body.comment }] },
            [
                { $set: { value: { $eq: [false, "$value"] } } }
            ],
            { new: true, upsert: true, select: "_id" }
        );
        if (!like) {
            return handleResponse(res, 500, errors.toggle_like)
        }
        return handleResponse(res, 200, success.toggle_like);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};