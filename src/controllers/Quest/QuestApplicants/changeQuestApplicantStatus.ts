import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";

export const changeQuestApplicantStatus = async (req: Request, res: Response) => {
    console.info("🔄 [changeQuestApplicantStatus] Request received with params:", req.params, "and query:", req.query);

    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatus(req.query, req.params);
        if (validationError) {
            console.warn("⚠️ [Validation] Failed with error:", validationError.details);
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { questApplicantId } = req.params;
        const { status } = req.query;

        console.debug("🔍 [DB] Fetching applicant with ID:", questApplicantId);
        const applicant = await QUEST_APPLICANT.findById(questApplicantId).select("status quest user");
        if (!applicant) {
            console.warn("❌ [DB] Quest applicant not found");
            return handleResponse(res, 404, errors.quest_applicant_not_found);
        }

        console.debug("🔍 [DB] Fetching quest with ID:", applicant.quest);
        const quest = await QUESTS.findById(applicant.quest);
        if (!quest) {
            console.warn("❌ [DB] Quest not found");
            return handleResponse(res, 404, errors.quest_not_found);
        }

        if (status === "rejected") {
            const projectedRejections = quest.totalRejected + 1;
            const rejectionRate = projectedRejections / quest.applicantCount;
            console.info(`📉 [Logic] Projected rejection rate: ${(rejectionRate * 100).toFixed(2)}%`);
            if (rejectionRate > 0.3) {
                console.warn("⛔ [Limit] Rejection cap exceeded");
                return handleResponse(res, 403, {
                    message: `Rejection cap reached. Max 30% of ${quest.applicantCount} applicants can be rejected.`,
                });
            }
        }

        if (status === "approved" && quest.leftApproved <= 0) {
            console.warn("⛔ [Limit] No approval slots left");
            return handleResponse(res, 403, errors.quest_applicant_approval);
        }

        const session = await QUEST_APPLICANT.startSession();
        console.log("🚀 [Transaction] Starting DB transaction");

        await session.withTransaction(async () => {
            // ✅ Update applicant
            console.debug("✏️ [DB] Updating applicant status to:", status);
            await QUEST_APPLICANT.findByIdAndUpdate(
                questApplicantId,
                { status },
                { session }
            );

            // ✅ Prepare quest update
            const questUpdate: any = { $inc: {}, $set: {} };
            if (status === "approved") {
                questUpdate.$inc.totalApproved = 1;
                questUpdate.$inc.leftApproved = -1;
            } else if (status === "rejected") {
                questUpdate.$inc.totalRejected = 1;
            }

            const newTotalApproved = quest.totalApproved + (status === "approved" ? 1 : 0);
            if (newTotalApproved >= quest.maxApplicants) {
                questUpdate.$set.status = "completed";
                console.info("🎯 [Quest] Quest marked as completed");
            }

            console.debug("✏️ [DB] Updating quest with:", questUpdate);
            await QUESTS.findByIdAndUpdate(quest._id, questUpdate, { session });

            // ✅ Reserve money on approval
            if (status === "approved") {
                console.debug("💰 [Wallet] Reserving balance for user:", applicant.user);
                await WALLET.findOneAndUpdate(
                    { user: applicant.user },
                    { $inc: { reservedBalance: quest.avgAmountPerPerson } },
                    { session }
                );
            }
        });

        console.log("✅ [Success] Status changed successfully");
        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        console.error("🔥 [Error] Exception in changeQuestApplicantStatus:", error);
        sendErrorToDiscord("PUT:quest-change-status-applicant", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};

