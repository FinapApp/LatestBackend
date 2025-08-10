import { Request, Response } from "express"
import { validateReportStory } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/report/report.model"
import { sendErrorToDiscord } from "../../config/discord/errorDiscord"

export const reportStory = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateReportStory(req.body, req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const reportStory = await REPORT.create({
            user: res.locals.userId,
            story: req.params.storyId,
            message: {
                sentBy: "user",
                ...req.body
            }
        })
        if (reportStory) {
            //send things to kafka
            return handleResponse(res, 200, success.story_reported, lang)
        }
        return handleResponse(res, 304, errors.story_reported, lang)
    } catch (error) {
        sendErrorToDiscord("POST:report-story", error)
        return handleResponse(res, 500, errors.catch_error, lang)
    }
}