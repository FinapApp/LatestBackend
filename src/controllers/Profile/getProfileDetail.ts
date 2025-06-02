import { Request, Response } from "express";
import { errors, handleResponse, } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { USERBIOLINKS } from "../../models/User/userBioLinks.model";
import Joi from "joi";
import { validateGetProfileDetail } from "../../validators/validators";
import { FOLLOW } from "../../models/User/userFollower.model";

export const getProfileDetail = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetProfileDetail(
            req.query
        );
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                validationError.details
            );
        }

        const requestedUserId = (req.query as { userId?: string }).userId;
        const currentUserId = res.locals.userId;
        const userId = requestedUserId || currentUserId;

        const [getProfileDetails, bioLink] = await Promise.all([
            USER.findById(
                userId,
                "name username followerCount followingCount flickCount description photo -_id",
                { lean: true }
            ),
            USERBIOLINKS.find({ user: userId }, "title url").lean()
        ]);

        if (!getProfileDetails) {
            return handleResponse(res, 400, errors.profile_not_found);
        }
        const profileDetail: any = {
            ...getProfileDetails,
            bioLink,
        };

        // fix this code // MF
        if (requestedUserId && requestedUserId !== currentUserId) {
            const followDoc = await FOLLOW.findOne({
                follower: currentUserId,
                following: requestedUserId
            }).lean();
            profileDetail.isFollowing = !!followDoc;
        }
        return handleResponse(res, 200, { profileDetail });
    } catch (error: any) {
        console.log(error);
        sendErrorToDiscord('GET:profile', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
