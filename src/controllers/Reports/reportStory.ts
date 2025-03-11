import { Request, Response } from "express"
import { validateReportStory, validateReportUser } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/reports/report.model"

export const reportStory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateReportStory(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const reportStory = await REPORT.create({
            user: res.locals.userId,
            story: req.params.storyId,
            ...req.body
        })
        if (reportStory) {
            //send things to kafka
            return handleResponse(res, 200, success.story_reported)
        }
        return handleResponse(res, 304, errors.story_reported)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error)
    }
}