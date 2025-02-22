import { Request, Response } from "express"
import { validateReportComment } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { SHARES } from "../../models/Share/share.model"

export const sharePost = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateReportComment(req.body, req.params);
        if (validationError) {
        return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const sharePost = await SHARES.create({
            user: res.locals.userId,
            reel: req.params.reelId,
        })
        if (sharePost) {
            //send things to kafka
            return handleResponse(res, 200, success.share_post)
        }
        return handleResponse(res, 304, errors.share_post)
    } catch (error) {
        console.log(error)
     return handleResponse(res, 500, errors.catch_error)
    }
}