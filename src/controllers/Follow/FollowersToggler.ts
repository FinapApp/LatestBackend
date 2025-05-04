import { Request, Response } from 'express';
import { validateFollowerId } from "../../validators/validators";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FOLLOW } from '../../models/User/userFollower.model';
import { USER } from '../../models/User/user.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const followerHandler = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateFollowerId(req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { followerId } = req.params;
        const { type } = req.query;
        const me = res.locals.userId;

        if (followerId === me) {
            return handleResponse(res, 400, errors.self_follow);
        }

        if (type === 'remove') {
            // Remove someone who follows *me*
            const existingFollow = await FOLLOW.findOneAndDelete({ follower: followerId, following: me });
            if (existingFollow) {
                await Promise.all([
                    USER.findByIdAndUpdate(me, { $inc: { followerCount: -1 } }, { new: true }),
                    USER.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }, { new: true })
                ]);
                return handleResponse(res, 200, success.follower_removed);
            } else {
                return handleResponse(res, 404, errors.follow_not_found);
            }
        } else {
            // Toggle following/unfollowing
            const existingFollow = await FOLLOW.findOneAndDelete({ follower: me, following: followerId });
            if (existingFollow) {
                await Promise.all([
                    USER.findByIdAndUpdate(me, { $inc: { followingCount: -1 } }, { new: true }),
                    USER.findByIdAndUpdate(followerId, { $inc: { followerCount: -1 } }, { new: true })
                ]);
                return handleResponse(res, 200, success.user_unfollowed);
            }

            const targetUser = await USER.findById(followerId, "private");
            if (!targetUser) {
                return handleResponse(res, 404, errors.user_not_found);
            }

            await Promise.all([
                USER.findByIdAndUpdate(me, { $inc: { followingCount: 1 } }, { new: true }),
                USER.findByIdAndUpdate(followerId, { $inc: { followerCount: 1 } }, { new: true })
            ]);

            await FOLLOW.create({
                follower: me,
                following: followerId,
                approved: targetUser.private ? false : true,
            });

            return handleResponse(res, 200, success.user_followed);
        }
    } catch (err) {
        console.error(err);
        sendErrorToDiscord("POST:/follower-handler", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
