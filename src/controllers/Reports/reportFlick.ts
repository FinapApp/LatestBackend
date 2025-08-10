import { Request, Response } from "express"
import { validateReportFlick } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/report/report.model"

export const reportFlick = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateReportFlick(req.body, req.params ,req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
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
            return handleResponse(res, 200, success.flick_reported, lang)
        }
        return handleResponse(res, 304, errors.flick_reported, lang)
    } catch (error) {
        console.log(error)
     return handleResponse(res, 500, errors.catch_error, lang)
    }
}