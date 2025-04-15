import { Request, Response } from "express";
import { handleResponse } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICATION } from "../../../models/Quest/questApplication.model";

export const getAllQuests = async (req: Request, res: Response) => {
    try {
       
        const data = await QUESTS.find({} , "-_a" , {
            populate : {
                path : "user",
                select : "name photo"
            }
        });
        const userApplications = await QUEST_APPLICATION.find({ user: res.locals.userId }, "-_id");
        const appliedQuestIds = new Set(userApplications.map(app => app.quest.toString()));

        // Merge info: mark each quest with `hasApplied: true/false`
        const mergedData = data.map(quest => {
            const questId = (quest._id as string); // Explicitly cast _id to string
            return {
                ...quest.toObject(),
                hasApplied: appliedQuestIds.has(questId.toString()),
            };
        });
        if (data) {
            return handleResponse(res,
                200,
                { quests: mergedData }
            );
        }
        return handleResponse(res, 404, { message: "No Quests Found" });
    } catch (err: any) {
        sendErrorToDiscord("GET:all-quests", err);
        return handleResponse(res, 500, { message: "Internal Server Error" });
    }
};
