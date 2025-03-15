import { Request, Response } from "express";
import { handleResponse } from "../../../utils/responseCodec";

export const getAllQuests = async (req: Request, res: Response) => {
    try {
        return handleResponse(res, 500, { message: "not working" })
    } catch (err: any) {
        console.log(err);
    }
};
