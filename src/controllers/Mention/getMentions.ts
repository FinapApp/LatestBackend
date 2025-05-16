    import { Request, Response } from "express";
    import Joi from "joi";
    import { errors, handleResponse } from "../../utils/responseCodec";
    import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { validateGetUsersAndHashtags } from "../../validators/validators";
    import { getIndex } from "../../config/melllisearch/mellisearch.config";

    export const getMentions = async (req: Request, res: Response) => {
        try {
            const validationError: Joi.ValidationError | undefined = validateGetUsersAndHashtags(req.query);
            if (validationError) {
                return handleResponse(res, 400, errors.validation, validationError.details);
            }
            let { q = "", page = 1, limit = 10 } = req.query as { q: string; page?: string | number; type?: string, limit?: string | number };
            limit = Number(limit)
            const offset = ((Number(page) || 1) - 1) * limit;
            const index = getIndex("USERS");
            const data = await index.search(q, {
                limit,
                offset,
                filter: [
                    `isDeactivated != true`
                ],
                attributesToRetrieve: ["userId", "name", "username", "photo"]
            });
            if (data.hits.length > 0) {
                const result = {
                    users: data.hits,
                    total: data.estimatedTotalHits,
                    page: Number(page) || 1,
                    totalPages: Math.ceil(data.estimatedTotalHits / limit) || 1,
                }
                return handleResponse(res, 200, result )
            }
            return handleResponse(res, 404, errors.user_not_found);
        } catch (error) {
            sendErrorToDiscord("GET:get-mentions", error);
            return handleResponse(res, 500, errors.catch_error);
        }
    };