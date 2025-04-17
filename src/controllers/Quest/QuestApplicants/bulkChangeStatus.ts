import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../../utils/responseCodec";
import Joi from "joi";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateQuestApplicantStatusBatch } from "../../../validators/validators";
import { QUESTS } from "../../../models/Quest/quest.model";
export const bulkChangeStatus = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestApplicantStatusBatch(req.query, req.body);
        if (validationError) return handleResponse(res, 400, errors.validation, validationError.details);

        const { questApplicantIds } = req.body;
        const { status } = req.query;
        
        const applicants = await QUEST_APPLICANT.find({
            _id: { $in: questApplicantIds },
            status: 'pending'
        }).populate('quest', 'totalApproved leftApproved maxApplicants');

        
        const questMap = new Map<string, {
            quest: any,
            approvalCount: number,
            applicantIds: string[]
        }>();

        for (const app of applicants) {
            const questId = app.quest._id.toString();
            if (!questMap.has(questId)) {
                questMap.set(questId, {
                    quest: app.quest,
                    approvalCount: 0,
                    applicantIds: []
                });
            }
            const entry = questMap.get(questId)!;
            entry.applicantIds.push(app._id.toString());
            if (status === 'approved') entry.approvalCount++;
        }

        
        if (status === 'rejected') {
            for (const [questId, entry] of questMap) {
                const minApproved = Math.ceil(entry.quest.maxApplicants * 0.3);
                if (entry.quest.totalApproved < minApproved) {
                    throw new Error(`Need ${minApproved} approvals before rejecting in quest ${questId}`);
                }
            }
        }
        
        await QUEST_APPLICANT.updateMany(
            { _id: { $in: questApplicantIds } },
            { $set: { status } },
        );

        
        const bulkOps: any[] = [];
        for (const [_, entry] of questMap) {
            const update: any = { $inc: {} };

            if (status === 'approved') {
                update.$inc.totalApproved = entry.approvalCount;
                update.$inc.leftApproved = -entry.approvalCount;
            } else if (status === 'rejected') {
                update.$inc.totalRejected = entry.applicantIds.length;
                
            }

            bulkOps.push({
                updateOne: {
                    filter: { _id: entry.quest._id },
                    update
                }
            });
        }

        await QUESTS.bulkWrite(bulkOps);
        return handleResponse(res, 200, success.status_changed_flicked);
    } catch (error) {
        sendErrorToDiscord("bulk-change-status", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};