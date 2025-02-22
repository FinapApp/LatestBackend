import { Request, Response } from "express";
import { handleResponse, errors, success } from "../../utils/responseCodec";

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('x-access-token', {
            httpOnly: true,
        });
        return handleResponse(res, 200, success.logout);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error);
    }
};
