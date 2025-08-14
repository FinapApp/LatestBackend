import { Request, Response } from 'express';
import { validateCreateQuestApplication } from "../../../validators/validators";
import { errors, handleResponse, Lang, success } from "../../../utils/responseCodec";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { QUEST_APPLICANT } from '../../../models/Quest/questApplicant.model';
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { QUESTS } from '../../../models/Quest/quest.model';
import { config } from '../../../config/generalconfig';
import { sendNotificationKafka } from '../../../utils/sendNotificationKafka';

export const createQuestApplicant = async (req: Request, res: Response) => {
        const lang = req.query.lang as Lang|| 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateQuestApplication(req.body, req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }

        const questApplicantId = req.params.questApplicantId;
        const user = res.locals.userId;
        const { quest } = req.body;

        // Parallel DB operations
        const [questData ,existingApplication] = await Promise.all([
            QUESTS.findById(quest, "status leftApproved applicantCount user mode"),
            QUEST_APPLICANT.findOne({ user, quest }, "status"),
        ]);
        if (!questData) {
            return handleResponse(res, 404, errors.quest_not_found, lang);
        }
        if (String(questData.user) === String(user)) {
            return handleResponse(res, 403, errors.cannot_apply_to_own_quest, lang);
        }
        if (!["pending", "paused"].includes(questData.status)) {
            return handleResponse(res, 403, errors.quest_not_authorized, lang);
        }
        if (existingApplication) {
            return handleResponse(res, 403, errors.quest_already_applied, lang);
        }
        // Create applicant & increment count in parallel
        const [createdApplicant ] = await Promise.all([
            QUEST_APPLICANT.create({
                _id: questApplicantId,
                user,
                ...req.body
            }),
            QUESTS.findByIdAndUpdate(quest, { $inc: { applicantCount: 1 } })
        ]);

        if (!createdApplicant) {
            return handleResponse(res, 500, errors.create_quest_applicants, lang);
        }
        // Notify the friends and some random users out of 20 users at max.
        sendNotificationKafka("QUEST_APPLICANT_CREATED", {
            userId : user,
            contentUserId: questData.user.toString(),  // Friends of the quest owner should be notified
            metadata: {
                questId: quest,
                description: Array.isArray(createdApplicant.description) ? createdApplicant.description.map(desc => desc.text).join(", ") : "",
                status: "pending",
                thumbnailURL: createdApplicant.media[0]?.thumbnail || "",
            },
        });
        if (questData.mode == "Goflick") {
            let qrString = `quest:${quest}:${questApplicantId}`;
            qrString = jwt.sign(
                { qrString },
                config.QR_SECRET,
                { expiresIn: config.QR_EXPIRE_TIME }
            );
            return handleResponse(res, 201, { qrString });
        }
        return handleResponse(res, 201, success.create_quest_applicants, lang);
    } catch (err) {
        console.error(err);
        sendErrorToDiscord("create-quest-applicant", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
