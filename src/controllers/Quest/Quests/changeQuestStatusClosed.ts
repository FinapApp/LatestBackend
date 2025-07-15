import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { validateChangeQuestStatus } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { WALLET } from "../../../models/Wallet/wallet.model";

export const changeQuestStatusClosed = async (req: Request, res: Response) => {
    const session = await QUESTS.startSession();
    try {
        const validationError: Joi.ValidationError | undefined = validateChangeQuestStatus(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questId } = req.params;

        await session.withTransaction(async () => {
            // Step 1: Find the quest and update status to closed
            const changeStatus = await QUESTS.findOneAndUpdate(
                { _id: questId, user: res.locals.userId },
                { status: "closed" },
                { new: true, session }
            );
            if (!changeStatus) {
                throw { code: 404, message: errors.quest_not_found };
            }

            // Step 2: Find approved applicants who are not deposited
            const approvedApplicants = await QUEST_APPLICANT.find({
                quest: questId,
                status: "approved",
                isDeposited: false
            }).session(session);

            // Step 3: Prepare wallet bulk operations to disperse balances
            const walletBulkOps = approvedApplicants.map(applicant => ({
                updateOne: {
                    filter: { user: applicant.user },
                    update: { $inc: { reservedBalance: changeStatus.avgAmountPerPerson } },
                    upsert: true
                }
            }));

            // Step 4: Execute wallet bulk write if there are approved applicants
            if (walletBulkOps.length > 0) {
                await WALLET.bulkWrite(walletBulkOps, { session });
            }

            // Step 5: Update search index
            const questPlain = changeStatus.toObject();
            const { user, media, description, ...restQuest } = questPlain;
            const questIndex = getIndex("QUESTS");
            await questIndex.addDocuments([
                {
                    ...restQuest,
                    questId,
                    status: "closed",
                },
            ]);
        });

        return handleResponse(res, 200, success.quest_status_closed);
    } catch (error: any) {
        console.error("🔥 Error in changeQuestStatusClosed:", error);
        sendErrorToDiscord("PATCH:quest-change-status-closed", error);
        return handleResponse(res, error.code || 500, error.message || errors.catch_error);
    } finally {
        session.endSession();
    }
};
