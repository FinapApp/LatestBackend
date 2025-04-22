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
        const questData = await QUESTS.findById(quest, "status leftApproved applicantCount");
        if (!questData) return handleResponse(res, 404, errors.quest_not_found);
        if (questData.status !== "pending") {
            return handleResponse(res, 403, errors.quest_not_approved);
        }
        const { leftApproved } = questData;
        const maxPendingThreshold = leftApproved + Math.ceil(leftApproved * 0.3); // buffer of 30%
        const currentPendingApplicants = await QUEST_APPLICANT.countDocuments({
            quest,
            status: "pending"
        });

        if (currentPendingApplicants >= maxPendingThreshold) {
            await QUESTS.findByIdAndUpdate(quest, { status: "paused" });
            return handleResponse(res, 400, {
                ...errors.max_applicants,
                message: `Pending applicant limit reached. Quest paused automatically.`
            });
        }

        const createdApplicant = await QUEST_APPLICANT.create({
            _id: questApplicantId,
            user,
            ...req.body
        });

        if (!createdApplicant) {
            return handleResponse(res, 500, errors.create_quest_applicants);
        }

        // increment total applicant count (denormalized field)
        await QUESTS.findByIdAndUpdate(quest, { $inc: { applicantCount: 1, leftApproved: -1 } });

        return handleResponse(res, 201, success.create_quest_applicants);
    } catch (err) {
        sendErrorToDiscord("create-quest-applicant", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
