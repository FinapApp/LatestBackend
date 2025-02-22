import { Request, Response } from "express"
import { validateReportUser } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/reports/report.model"

export const reportUser = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateReportUser(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const reportUser = await REPORT.create({
            user: res.locals.userId,
            reportedTo: req.params.userId,
            message: req.body.reason,
        })
        if (reportUser) {
            //send things to kafka
            return handleResponse(res, 200, success.user_reported)
        }
        return handleResponse(res, 304, errors.user_reported)
    } catch (error) {
        console.log(error)
     return handleResponse(res, 500, errors.catch_error)
    }
}