import { Request, Response } from "express";
import { handleResponse } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";

export const getAllQuests = async (req: Request, res: Response) => {
    try {
        const data = await QUESTS.find({});
        if (data) {
            return handleResponse(res,
                200,
                {QUESTS : data}
            );
        }
        return handleResponse(res, 404, { message: "No Quests Found" });
    } catch (err: any) {
        console.log(err);
    }
};
