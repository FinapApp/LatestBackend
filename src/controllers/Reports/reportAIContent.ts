import { Request, Response } from "express"
import { validateReportAIContent } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { REPORT } from "../../models/report/report.model"

export const reportAIContent = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateReportAIContent(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
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
            return handleResponse(res, 200, success.ai_content_reported)
        }
        return handleResponse(res, 304, errors.ai_content_reported)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error)
    }
}