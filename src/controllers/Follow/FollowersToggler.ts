import { Request, Response } from 'express';
import { validateFollowerId } from "../../validators/validators";
import { errors, handleResponse, Lang, success } from "../../utils/responseCodec";
import Joi from "joi";
import { FOLLOW } from '../../models/User/userFollower.model';
import { USER } from '../../models/User/user.model';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const followerHandler = async (req: Request, res: Response) => {
    const lang = req.query.lang as Lang|| 'en';
    try {
        const validationError: Joi.ValidationError | undefined = validateFollowerId(req.params , req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, lang , validationError.details);
        }

        const { followerId } = req.params;
        const { type } = req.query;
        const me = res.locals.userId;

        if (followerId === me) {
            return handleResponse(res, 400, errors.self_follow, lang);
        }

        if (type === 'remove') {
            // Remove someone who follows *me*
            const existingFollow = await FOLLOW.findOneAndDelete({ follower: followerId, following: me });
            if (existingFollow) {
                await Promise.all([
                    USER.findByIdAndUpdate(me, { $inc: { followerCount: -1 } }, { new: true }),
                    USER.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }, { new: true })
                ]);
                return handleResponse(res, 200, success.follower_removed, lang);
            } else {
                return handleResponse(res, 404, errors.follow_not_found, lang);
            }
        } else {
            // Toggle following/unfollowing
            const existingFollow = await FOLLOW.findOneAndDelete({ follower: me, following: followerId });
            if (existingFollow) {
                await Promise.all([
                    USER.findByIdAndUpdate(me, { $inc: { followingCount: -1 } }, { new: true }),
                    USER.findByIdAndUpdate(followerId, { $inc: { followerCount: -1 } }, { new: true }),
                ]);
                return handleResponse(res, 200, success.user_unfollowed, lang);
            }

            const targetUser = await USER.findById(followerId, "private isDeactivated");
            if (!targetUser) {
                return handleResponse(res, 404, errors.user_not_found, lang);
            }
            if (targetUser.isDeactivated) {
                return handleResponse(res, 400, errors.user_deactivated, lang);
            }
            await Promise.all([
                USER.findByIdAndUpdate(me, { $inc: { followingCount: 1 } }, { new: true }),
                USER.findByIdAndUpdate(followerId, { $inc: { followerCount: 1 } }, { new: true })
            ]);
            const toggleFollow = await FOLLOW.create({
                follower: me,
                following: followerId,
                approved: targetUser.private ? false : true,
            });
            if (toggleFollow) {
                // const myData = await USER.findById(me, "username photo");
                if (targetUser.private) {
                    // Notify the followed user about the new follower
                    // sendNotificationKafka('new-follower', {
                    //     userId: followerId,
                    //     followerId: me,
                    //     followerData: myData
                    // });
                }
                // Optionally, you can send a notification to the follower
                // sendNotificationKafka('followed', {
                //     userId: me,
                //     followedId: followerId,
                //     followedData: targetUser
                // });
                return handleResponse(res, 200, success.user_followed, lang);
            }
            return handleResponse(res, 304, errors.toggle_follow, lang);
        }
    } catch (err) {
        console.error(err);
        sendErrorToDiscord("POST:/follower-handler", err);
        return handleResponse(res, 500, errors.catch_error , lang);
    }
};
