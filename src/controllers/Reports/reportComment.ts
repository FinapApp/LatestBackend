import { Request, Response } from "express"
import { validateReportComment } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/reports/report.model"

export const reportComment = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateReportComment(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const reportUser = await REPORT.create({
            user: res.locals.userId,
            comment: req.params.commentId,
            message: {
                sentBy  : "user" , 
                ...req.body
            }
        })
        if (reportUser) {
            //send things to kafka
            return handleResponse(res, 200, success.comment_reported)
        }
        return handleResponse(res, 304, errors.comment_reported)
    } catch (error) {
        console.log(error)
     return handleResponse(res, 500, errors.catch_error)
    }
}