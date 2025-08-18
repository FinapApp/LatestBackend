import { Request, Response } from 'express';
import { validateFollowerId } from "../../validators/validators";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FOLLOW } from '../../models/User/userFollower.model';
import { USER } from '../../models/User/user.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';
import { sendFollowNotification } from '../../utils/utils';
import { NOTIFICATION } from '../../models/User/userNotification.model';

export const followerHandler = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang || 'en';
    try {
        const validationError: Joi.ValidationError | undefined =
            validateFollowerId(req.params, req.query);
        if (validationError) {
            return handleResponse(
                res,
                400,
                errors.validation,
                lang,
                validationError.details
            );
        }

        const { followerId } = req.params;
        const { type } = req.query;
        const me = res.locals.userId;

        if (followerId === me) {
            return handleResponse(res, 400, errors.self_follow, lang);
        }

        if (type === 'remove') {
            const existingFollow = await FOLLOW.findOneAndDelete({
                follower: followerId,
                following: me,
            });
            if (existingFollow) {
                await Promise.all([
                    USER.findByIdAndUpdate(me, { $inc: { followerCount: -1 } }),
                    USER.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }),
                ]);
                return handleResponse(res, 200, success.follower_removed, lang);
            } else {
                return handleResponse(res, 404, errors.follow_not_found, lang);
            }
        } else {
            // Try to unfollow first
            const existingFollow = await FOLLOW.findOneAndDelete({
                follower: me,
                following: followerId,
            });
            if (existingFollow) {
                await Promise.all([
                    USER.findByIdAndUpdate(me, { $inc: { followingCount: -1 } }),
                    USER.findByIdAndUpdate(followerId, { $inc: { followerCount: -1 } }),
                ]);
                await NOTIFICATION.deleteMany({
                    follower: me,
                    user : followerId,
                });
                // If unfollowed, return success
                return handleResponse(res, 200, success.user_unfollowed, lang);
            }

            // Follow logic
            const targetUser = await USER.findById(
                followerId,
                "private isDeactivated username photo"
            );
            if (!targetUser) {
                return handleResponse(res, 404, errors.user_not_found, lang);
            }
            if (targetUser.isDeactivated) {
                return handleResponse(res, 400, errors.user_deactivated, lang);
            }

            await Promise.all([
                USER.findByIdAndUpdate(me, { $inc: { followingCount: 1 } }),
                USER.findByIdAndUpdate(followerId, { $inc: { followerCount: 1 } }),
            ]);

            const toggleFollow = await FOLLOW.create({
                follower: me,
                following: followerId,
                approved: targetUser.private ? false : true,
            });

            if (toggleFollow) {
                // Kafka notifications
                if (targetUser.private) {
                    // Send a follow request notification
                    await sendFollowNotification("FOLLOW_REQUEST", me, followerId);
                } else {
                    // Immediately followed
                    await sendFollowNotification("FOLLOW", me, followerId);
                }

                return handleResponse(res, 200, success.user_followed, lang);
            }

            return handleResponse(res, 304, errors.toggle_follow, lang);
        }
    } catch (err) {
        console.error(err);
        sendErrorToDiscord("POST:/follower-handler", err);
        return handleResponse(res, 500, errors.catch_error, lang);
    }
};

