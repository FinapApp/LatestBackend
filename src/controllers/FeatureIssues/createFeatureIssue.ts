import { Request, Response } from "express"
import { validateCreateFeatureIsssue } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec"
import { FEATUREISSUES } from "../../models/FeatureIssues/featureIssue.model"

export const createFeatureIssue = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFeatureIsssue(req.body, req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }
        const userId = res.locals.userId;
        const featureIssueId = req.params.featureIssueId;
        const { message, attachment, ...rest } = req.body
        const featureIssue = await FEATUREISSUES.create({
            _id: featureIssueId,
            user: userId,
            message: {
                sentBy: "user",
                message,
                attachment,
            },
            ...rest
        })
        if (featureIssue) {
            //send things to kafka
            return handleResponse(res, 200, success.create_feature_issue , lang)
        }
        return handleResponse(res, 304, errors.create_feature_issue , lang)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error, lang)
    }
}