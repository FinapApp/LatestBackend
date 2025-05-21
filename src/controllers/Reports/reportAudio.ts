import { Request, Response } from "express"
import { validateReportAudio } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/Reports/report.model"

export const reportAudio = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateReportAudio(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const reportAudio = await REPORT.create({
            user: res.locals.userId,
            audio: req.params.audioId,
            ...req.body
        })
        if (reportAudio) {
            //send things to kafka
            return handleResponse(res, 200, success.audio_reported)
        }
        return handleResponse(res, 304, errors.audio_reported)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error)
    }
}