import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatusViaQR } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { config } from "../../../config/generalconfig";

export const changeVerifyStatusQRApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatusViaQR(req.body, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const userId = res.locals.userId; // Quest owner
        const { qrString } = req.body;

        // 1. Decode the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(qrString, config.QR_SECRET);
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') return handleResponse(res, 401, errors.jwt_expired);
            if (err.name === 'JsonWebTokenError') return handleResponse(res, 401, errors.invalid_jwt);
            return handleResponse(res, 401, errors.jwt_verification_error);
        }

        const parts = decoded.qrString?.split(":");
        if (!parts || parts.length !== 3 || parts[0] !== "quest") {
            return handleResponse(res, 400, errors.invalid_qr_string);
        }

        const [_, questId, questApplicantId] = parts;

        // 2. Ensure user is owner of the quest
        const quest = await QUESTS.findById(questId, "user");
        if (!quest) return handleResponse(res, 404, errors.quest_not_found);

        if (String(quest.user) !== String(userId)) {
            return handleResponse(res, 403, errors.permission_denied);
        }

        // 3. Update the applicant's status to "verified"
        const updated = await QUEST_APPLICANT.findByIdAndUpdate(
            questApplicantId,
            { verified: true },
            { new: true }
        );

        if (!updated) return handleResponse(res, 404, errors.quest_applicant_not_found);

        return handleResponse(res, 200, success.qr_verified_success);
    } catch (error) {
        console.error(error);
        sendErrorToDiscord("verify-quest-applicant-via-qr", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
