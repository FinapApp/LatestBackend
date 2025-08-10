import { Request, Response } from "express";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import { SESSION } from "../../models/User/userSession.model";
import { sendNotificationKafka } from "../../utils/sendNotificationKafka"; // bulk sender!

export const deleteSessions = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        // 1. Find sessions to be deleted, and extract their fcmTokens
        const sessionsToDelete = await SESSION.find({
            user: res.locals.userId,
            _id: { $ne: res.locals.sessionId }
        }, "fcmToken device location"); // select only necessary fields

        if (!sessionsToDelete.length) {
            return handleResponse(res, 404, errors.session_deleted , lang);
        }
        
        const tokens = sessionsToDelete
            .map(s => s.fcmToken)
            .filter(Boolean);
        await SESSION.deleteMany({
            user: res.locals.userId,
            _id: { $ne: res.locals.sessionId }
        });
        sendNotificationKafka(
            'SESSION_DELETED_ALL_BULK',
            {
                userId: res.locals.userId,
                sessionId: res.locals.sessionId,
                tokens
            }
        );
        return handleResponse(res, 200, success.session_deleted, lang);
    } catch (error) {
        console.log(error);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
     
