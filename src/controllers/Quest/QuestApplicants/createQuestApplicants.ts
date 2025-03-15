import { Request, Response } from 'express'
import { validateCreateQuestApplication } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { QUEST_APPLICATION } from '../../../models/Quest/questApplication.model';
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { QUESTS } from '../../../models/Quest/quest.model';

export const createQuestApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateQuestApplication(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const questApplicantId = req.params.questApplicantId
        const user = res.locals.userId
        const { quest } = req.body
        const checkMaxCount = await QUESTS.findById(quest, "maxApplicants")
        const getCurrentCountApplicant = await QUEST_APPLICATION.countDocuments({ quest })
        if (checkMaxCount && getCurrentCountApplicant > checkMaxCount.maxApplicants * 10 / 100) {
            return handleResponse(res, 400, errors.max_applicants)
        }
        const createQuestApplicants = await QUEST_APPLICATION.create({
            _id: questApplicantId,
            user,
            ...req.body
        });
        if (!createQuestApplicants) {
            return handleResponse(res, 500, errors.create_quest_applicants);
        }
        return handleResponse(res, 500, success.create_quest_applicants);
    } catch (err) {
        console.log("=====> err" , err)
        sendErrorToDiscord("create-quest-applicant", err)
        return handleResponse(res, 500, errors.catch_error)
    }
}