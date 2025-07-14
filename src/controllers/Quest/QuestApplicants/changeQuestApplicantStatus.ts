import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { WALLET } from "../../../models/Wallet/wallet.model";
export const changeQuestApplicantStatus = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatus(req.query, req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { questApplicantId } = req.params;
        const { status } = req.query;

        const applicant = await QUEST_APPLICANT.findById(questApplicantId).select("status quest user");
        if (!applicant) return handleResponse(res, 404, errors.quest_applicant_not_found);

        const quest = await QUESTS.findById(applicant.quest);
        if (!quest) return handleResponse(res, 404, errors.quest_not_found);

        if (status === "rejected") {
            const projectedRejections = quest.totalApproved + quest.applicantCount - quest.totalApproved >= quest.maxApplicants
            if (projectedRejections) {
                return handleResponse(res, 403, {
                    message: `Rejection cap reached. Max 30% of ${quest.applicantCount} applicants can be rejected.`,
                });
            }
        }

        if (status === "approved" && quest.leftApproved <= 0) {
            return handleResponse(res, 403, errors.quest_applicant_approval);
        }

        // ✅ Step 1: Perform applicant status update + quest update atomically
        const session = await QUEST_APPLICANT.startSession();
        await session.withTransaction(async () => {
            // ✅ Update applicant
            await QUEST_APPLICANT.findByIdAndUpdate(
                questApplicantId,
                { status },
                { session }
            );

            // ✅ Update quest
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
            }

            await QUESTS.findByIdAndUpdate(quest._id, questUpdate, { session });

            // ✅ Reserve money only on approval
            if (status === "approved") {
                await WALLET.findOneAndUpdate(
                    { user: applicant.user },
                    { $inc: { reservedBalance: quest.avgAmountPerPerson } },
                    { session }
                );
            }
        });

        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        console.error("Error in changeQuestApplicantStatus:", error);
        sendErrorToDiscord("PUT:quest-change-status-applicant", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
