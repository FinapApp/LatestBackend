import { Request, Response } from "express";
import { errors, handleResponse, } from "../../../utils/responseCodec";
import { USERPREFERENCE } from "../../../models/User/userPreference.model";

export const getTheme = async (req: Request, res: Response) => {
    try {
        const user = res.locals.userId
        const getTheme = await USERPREFERENCE.findById(user , "theme -_id")
        if (getTheme) {
            return handleResponse(res, 200, { THEME : getTheme.theme });
        } 
        return handleResponse(res, 400, errors.get_theme);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};