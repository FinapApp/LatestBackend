import { Request, Response } from "express"
import { validateCreateFeatureIsssue, } from "../../validators/validators"
import Joi from "joi"
import { errors, handleResponse, success } from "../../utils/responseCodec"
import { FEATUREISSUES } from "../../models/FeatureIssues/featureIssue.model"

export const createFeatureIssue = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFeatureIsssue(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { userId } = req.params;
        const { message , attachment ,...rest } = req.body
        const featureIssue = await FEATUREISSUES.create({
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
            return handleResponse(res, 200, success.create_feature_issue)
        }
        return handleResponse(res, 304, errors.create_feature_issue)
    } catch (error) {
        console.log(error)
     return handleResponse(res, 500, errors.catch_error)
    }
}