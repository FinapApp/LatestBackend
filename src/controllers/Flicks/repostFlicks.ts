import { Response, Request } from "express";
import { validateFlickId,} from "../../validators/validators";
import { handleResponse, errors} from "../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
export const repostFlicks = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFlickId(
            req.params
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }
     
    } catch (err: any) {
        sendErrorToDiscord("PUT:update-flick", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
