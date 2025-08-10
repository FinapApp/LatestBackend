import { Request, Response } from "express"
import { validateReportAIContent } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/report/report.model"

export const reportAIContent = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateReportAIContent(req.body , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const { aiModel, aiConversationId, aiResponse, aiRequest, attachment, message } = req.body;
        const userId = res.locals.userId;
        const reportAIContent = await REPORT.create({
            user: userId,
            AI: {
                aiModel,
                aiConversationId,
                aiResponse,
                aiRequest,
            },
            message: {
                sentBy: "user",
                attachment,
                message
            }
        })
        if (reportAIContent) {
            //send things to kafka
            return handleResponse(res, 200, success.ai_content_reported , lang);
        }
        return handleResponse(res, 304, errors.ai_content_reported , lang);
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error , lang);
    }
}