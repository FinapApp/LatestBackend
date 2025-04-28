import { Request, Response } from 'express';
import { validateCreateFollower } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FOLLOW } from '../../models/User/userFollower.model';
import { USER } from '../../models/User/user.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
export const followerToggle = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFollower(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { followerId } = req.params; 
        const me = res.locals.userId;      
        if (followerId === me) {
            return handleResponse(res, 400, errors.self_follow);
        }
        const existingFollow = await FOLLOW.findOneAndDelete({ follower: me, following: followerId }) as any;
        if (existingFollow) {
            return handleResponse(res, 200, success.user_unfollowed);
        }
        const targetUser = await USER.findById(followerId, "private");
        if (!targetUser) {
            return handleResponse(res, 404, errors.user_not_found);
        }
        await FOLLOW.create({
            follower: me,
            following: followerId,
            approved: targetUser.private ? false : true,
        });
        return handleResponse(res, 200, success.user_followed);
    } catch (err) {
        console.error(err);
        sendErrorToDiscord("POST:/follow", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
