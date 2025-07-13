import { Request, Response } from "express";
import { handleResponse, errors, success } from "../../utils/responseCodec";
import { SESSION } from "../../models/User/userSession.model";

export const logout = async (req: Request, res: Response) => {
    try {
        const { userId, sessionId } = res.locals
        const deleteSessions = await SESSION.findOneAndDelete({ user: userId, _id: sessionId });
        if (!deleteSessions) {
            return handleResponse(res, 400, errors.session_not_found);
        }
        return handleResponse(res, 200, success.logout);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error);
    }
};
