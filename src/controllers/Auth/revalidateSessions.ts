import { Request, Response } from 'express'
import { errors, handleResponse } from '../../utils/responseCodec';
import jwt from 'jsonwebtoken'
import { config } from '../../config/generalconfig';
import { SESSION } from '../../models/User/userSession.model';
import Joi from 'joi';
import { validateRefreshToken } from '../../validators/validators';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const revalidateSessions = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateRefreshToken(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { refreshToken } = req.body
        if (!refreshToken) {
            return handleResponse(res, 400, errors.no_token);
        }
        jwt.verify(refreshToken, config.JWT.REFRESH_TOKEN_SECRET, async (err: any, data: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return handleResponse(res, 401, errors.refresh_token_expired);
                } else if (err.name === 'JsonWebTokenError') {
                    return handleResponse(res, 401, errors.invalid_refresh_token);
                } else {
                    return handleResponse(res, 401, errors.refresh_token_not_found);
                }
            }
            if (data) {
                const { userId } = data
                const checkSession = await SESSION.findOne({ refreshToken, user: userId }, "_id")
                if (!checkSession) {
                    return handleResponse(res, 400, errors.retry_login);
                }
                const accessToken = jwt.sign(
                    { userId , sessionId: checkSession._id },
                    config.JWT.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE_IN }
                );
                return handleResponse(res, 200, { accessToken });
            }
        })
    } catch (error) {
        console.log(error);
        sendErrorToDiscord("POST:revalidate-sessions", error)
        return handleResponse(res, 500, errors.catch_error);
    }
}
