import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICATION } from "../../../models/Quest/questApplication.model";
import {  validateChangeStatusQuestApplicant } from "../../../validators/validators";

export const changeStatusForQuestApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateChangeStatusQuestApplicant(req.body , req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questApplicantId } = req.params;
        const { status } = req.body;
        const updateQuestApplicant = await QUEST_APPLICATION.findByIdAndUpdate(questApplicantId, { status });
        if (!updateQuestApplicant) {
            return handleResponse(res, 500, errors.status_changed_flicked);
        }
        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        sendErrorToDiscord("change-status-applicant", error)
        return handleResponse(res, 500, errors.catch_error);
    }
};