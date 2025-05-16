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

        // Parallel DB operations
        const [questData, existingApplication, pendingCount] = await Promise.all([
            QUESTS.findById(quest, "status leftApproved applicantCount user"),
            QUEST_APPLICANT.findOne({ user, quest }, "status"),
            QUEST_APPLICANT.countDocuments({ quest, status: "pending" })
        ]);

        if (!questData) {
            return handleResponse(res, 404, errors.quest_not_found);
        }
        if (String(questData.user) === String(user)) {
            return handleResponse(res, 403, errors.cannot_apply_to_own_quest);
        }
        if (questData.status !== "pending") {
            return handleResponse(res, 403, errors.quest_not_approved);
        }

        if (existingApplication) {
            return handleResponse(res, 403, errors.quest_already_applied);
        }

        const { leftApproved } = questData;
        const maxPendingThreshold = leftApproved + Math.ceil(leftApproved * 0.3);

        // Handle over-threshold logic
        if (pendingCount >= maxPendingThreshold) {
            // Pause quest and exit
            await QUESTS.findByIdAndUpdate(quest, { status: "paused" });
            return handleResponse(res, 400, {
                ...errors.max_applicants,
                message: `Pending applicant limit reached. Quest paused automatically.`
            });
        }

        // Create applicant & increment count in parallel
        const [createdApplicant] = await Promise.all([
            QUEST_APPLICANT.create({
                _id: questApplicantId,
                user,
                ...req.body
            }),
            QUESTS.findByIdAndUpdate(quest, { $inc: { applicantCount: 1 } })
        ]);

        if (!createdApplicant) {
            return handleResponse(res, 500, errors.create_quest_applicants);
        }
        return handleResponse(res, 201, success.create_quest_applicants);
    } catch (err) {
        sendErrorToDiscord("create-quest-applicant", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
