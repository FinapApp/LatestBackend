import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/generalconfig";
import { errors, handleResponse } from "../utils/responseCodec";

export const isAuthenticatedUserIfNot: any = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token: string = req.headers["authorization"] as string;
        if (!token) {
            return handleResponse(res, 401, errors.no_token);
        }
        const tokenArray = token.split(" ") as ['Bearer', string];
        jwt.verify(tokenArray[1], config.JWT.ACCESS_TOKEN_SECRET, (err, data: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return handleResponse(res, 401, errors.jwt_expired);
                } else if (err.name === 'JsonWebTokenError') {
                    return handleResponse(res, 401, errors.invalid_jwt);
                } else {
                    return handleResponse(res, 401, errors.jwt_verification_error);
                }
            }
            if (data) {
                res.locals["userId"] = data.userId;
            }
            next()
        })
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error, err);
    }
};
