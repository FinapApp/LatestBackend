import { Request, Response } from 'express';
import { validateCreateFollower } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FOLLOWER } from '../../models/User/userFollower.model';
import { USER } from '../../models/User/user.model';

export const followerToggle = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateCreateFollower(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { followerId } = req.params;
        const user = res.locals.userId;

        if (followerId === user) {
            return handleResponse(res, 400, errors.self_follow);
        }
        // Try deleting first (to handle unfollow)
        const unfollow = await FOLLOWER.findOneAndDelete({ follower: user, following: followerId });
        if (unfollow) {
            //SEND TO MQ TO CHECK FOR THE NOTIFICATION TO BE DELETED IF I UNFOLLOW SOMEONE
            return handleResponse(res, 200, success.user_unfollowed);
        }
        let checkPrivate = await USER.findById(followerId, "private");
        let followUser
        if (checkPrivate?.private) {
            followUser = await FOLLOWER.create({ follower: user, following: followerId, approved: false });
        } else {
            followUser = await FOLLOWER.create({ follower: user, following: followerId });
        }
        // If not found, create (to handle follow)
        if (followUser) {
            //SEND TO MQ TO CHECK FOR THE NOTIFICATION TO BE CREATED FOR THE USER IF I FOLLOW SOMEONE
            // NOTIFY THAT USER WITH ITS FCM TOKEN THAT SOMEONE JUST FOLLOWED THEM
            return handleResponse(res, 200, success.user_followed);
        }
        return handleResponse(res, 500, errors.user_followed);
    } catch (err) {
        return handleResponse(res, 500, errors.catch_error);
    }
};
