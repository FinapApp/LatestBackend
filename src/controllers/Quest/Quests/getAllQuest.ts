import { Request, Response } from "express";
import { handleResponse } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";

export const getAllQuests = async (req: Request, res: Response) => {
    try {
        const data = await QUESTS.find({} , "-_a" , {
            populate : {
                path : "user",
                select : "name photo"
            }
        });
        if (data) {
            return handleResponse(res,
                200,
                {quests : data}
            );
        }
        return handleResponse(res, 404, { message: "No Quests Found" });
    } catch (err: any) {
        sendErrorToDiscord("GET:all-quests", err);
        return handleResponse(res, 500, { message: "Internal Server Error" });
    }
};
