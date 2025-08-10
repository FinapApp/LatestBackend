import { Request, Response } from "express"
import { validateReportAudio } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/report/report.model"

export const reportAudio = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateReportAudio(req.body, req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const reportAudio = await REPORT.create({
            user: res.locals.userId,
            audio: req.params.audioId,
            ...req.body
        })
        if (reportAudio) {
            //send things to kafka
            return handleResponse(res, 200, success.audio_reported, lang)
        }
        return handleResponse(res, 304, errors.audio_reported, lang)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error, lang)
    }
}