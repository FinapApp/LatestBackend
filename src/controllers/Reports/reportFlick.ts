import { Request, Response } from "express"
import { validateReportFlick } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/report/report.model"

export const reportFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateReportFlick(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const reportUser = await REPORT.create({
            user: res.locals.userId,
            flick: req.params.flickId,
            message: {
                sentBy: "user",
                ...req.body
            }
        })
        if (reportUser) {
            //send things to kafka
            return handleResponse(res, 200, success.flick_reported)
        }
        return handleResponse(res, 304, errors.flick_reported)
    } catch (error) {
        console.log(error)
     return handleResponse(res, 500, errors.catch_error)
    }
}