import { Request, Response } from 'express'
import Joi from 'joi';
import { validateGetAllLikes } from '../../validators/validators';
import { errors, handleResponse } from '../../utils/responseCodec';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import { LIKE } from '../../models/Likes/likes.model';

export const getAllLikes = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetAllLikes(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { id, type }: { id: string, type: 'quest' | 'comment' | 'flick' } = req.query as { id: string, type: 'quest' | 'comment' | 'flick' };
        let query: { value: boolean, quest?: string, flick?: string, comment?: string } = { value: true };
        if (type == 'flick') query.flick = id;
        if (type == 'comment') query.comment = id;
        if (type == 'quest') query.quest = id;
        console.log(query, "query")
        const LIKELIST = await LIKE.find(query, "user -_id", {
            populate: [
                {
                    path: "user",
                    select: "username photo"
                }
            ],
            sort: {
                createdAt: -1
            }
        })
        if (!LIKELIST) {
            return handleResponse(res, 404, errors.comment_not_found)
        }
        return handleResponse(res, 200, { likeList : LIKELIST })
    } catch (error) {
        sendErrorToDiscord("get-comments", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}
