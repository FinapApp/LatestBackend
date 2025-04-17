import { Request, Response } from 'express';
import { validateCreateQuestApplication } from "../../../validators/validators";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { QUEST_APPLICANT } from '../../../models/Quest/questApplicant.model';
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { QUESTS } from '../../../models/Quest/quest.model';

export const createQuestApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateQuestApplication(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const questApplicantId = req.params.questApplicantId;
        const user = res.locals.userId;
        const { quest } = req.body;

        const questData = await QUESTS.findById(quest, "status leftApproved");
        if (!questData) {
            return handleResponse(res, 404, errors.quest_not_found);
        }

        if (questData.status !== "pending") {
            return handleResponse(res, 403, errors.quest_not_approved);
        }

        const leftApproved = questData.leftApproved;
        const maxAllowedThisBatch = leftApproved + Math.ceil(leftApproved * 0.3);

        const currentApplicantCount = await QUEST_APPLICANT.countDocuments({
            quest,
            status: "pending"
        });

        if (currentApplicantCount >= maxAllowedThisBatch) {
            // Optional: pause quest
            await QUESTS.findByIdAndUpdate(quest, { status: "paused" });
            return handleResponse(res, 400, errors.max_applicants);
        }

        const createQuestApplicants = await QUEST_APPLICANT.create({
            _id: questApplicantId,
            user,
            ...req.body
        });

        if (!createQuestApplicants) {
            return handleResponse(res, 500, errors.create_quest_applicants);
        }

        return handleResponse(res, 201, success.create_quest_applicants);

    } catch (err) {
        sendErrorToDiscord("create-quest-applicant", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
