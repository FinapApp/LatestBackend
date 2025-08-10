import { Request, Response } from 'express'
import { errors, handleResponse, Lang } from '../../utils/responseCodec';
import { SESSION } from '../../models/User/userSession.model';

export const getSessions = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const user = res.locals.userId
        let response = await SESSION.find({ user }, "device ip os location createdAt")
        if (!response) {
            return handleResponse(res, 304, errors.session_not_found, lang)
        }
        return handleResponse(res, 200, { SESSION: response, self: res.locals.sessionId }, lang)
    } catch (error) {
        console.log(error)
        return handleResponse(res, 500, errors.catch_error, lang)
    }
}