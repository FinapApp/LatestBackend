import { Response, Request } from "express";
import { validateUpdateProfile } from "../../../validators/validators";
import { handleResponse, errors, success, Lang } from "../../../utils/responseCodec";
import Joi from "joi";
import { USER } from "../../../models/User/user.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { HASHTAGS } from "../../../models/User/userHashTag.model";
import { getIndex } from "../../../config/melllisearch/mellisearch.config";


export const updateProfileDetails = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateUpdateProfile(
            req.body , req.query 
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                lang,
                validationError.details
            );
        }
        const { newHashTags, ...rest } = req.body;
        if (newHashTags) {
            const createHashTags = await HASHTAGS.insertMany(newHashTags.map((tag: { id: string, value: string }) => ({ value: tag.value, _id: tag.id })));
            const hashTagIndex = getIndex("HASHTAG");
            await hashTagIndex.addDocuments(newHashTags.map((tag: { id: string, value: string }) => ({ hashtagId: tag.id, value: tag.value ,count: 1})));
            if (!createHashTags) {
                return handleResponse(res, 404, errors.create_hashtags, lang);
            }
        }
        const userId = res.locals.userId;
        const updateProfile = await USER.findByIdAndUpdate(
            userId,
            rest,
            { new: true ,lean: true} // Return the updated document
        );
        if (updateProfile) {
            const userIndex = getIndex("USERS");
            await userIndex.addDocuments([
                {
                    userId,
                    ...updateProfile,
                }
            ]);
            return handleResponse(res, 200, success.profile_updated     , lang);
        }
        return handleResponse(res, 304, errors.profile_not_updated, lang);
    } catch (err: any) {
        if (err.code === 11000) {
            const key = err?.keyValue ? Object.keys(err.keyValue)[0] : null;
            if (key === "email") {
                return handleResponse(res, 500, errors.email_exist, lang);
            }
            if (key === "username") {
                return handleResponse(res, 500, errors.username_exist, lang);
            }
            if (key === "phone") return handleResponse(res, 500, errors.phone_exist, lang);
        }
        sendErrorToDiscord("PUT:profile", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};
