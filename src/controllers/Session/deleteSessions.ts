import { Request, Response } from "express"
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { SESSION } from "../../models/User/userSession.model";

export const deleteSessions = async (req: Request, res: Response) => {
    try {
        const deleteSessions = await SESSION.deleteMany({
            user: res.locals.userId,
            _id: { $ne: res.locals.sessionId }
        });
        if (deleteSessions) {
            return handleResponse(res, 200, success.session_deleted)
        }
        return handleResponse(res, 404, errors.session_deleted)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error)
    }
}
