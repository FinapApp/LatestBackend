import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { QUESTS } from "../../models/Quest/quest.model";
import { LIKE } from "../../models/Likes/likes.model";
import { COMMENT } from "../../models/Comment/comment.model";
import { FOLLOW } from "../../models/User/userFollower.model";
import { FEEDBACK } from "../../models/Feedback/feedback.model";
import { REPORT } from "../../models/reports/report.model";
import { SEARCHHISTORY } from "../../models/SearchHistory/searchHistory.model";
import { STORY } from "../../models/Stories/story.model";
import { STORYVIEW } from "../../models/Stories/storyView.model";
import { USERPREFERENCE } from "../../models/User/userPreference.model";
import { USERBIOLINKS } from "../../models/User/userBioLinks.model";
import { SESSION } from "../../models/User/userSession.model";
import { WALLET } from "../../models/Wallet/wallet.model";

export const deleteAccount = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    try {
        // Fetch follow relations
        const follows = await FOLLOW.find({
            $or: [{ follower: userId }, { following: userId }]
        });

        const bulkUpdates: any[] = [];

        for (const follow of follows) {
            // If the user was following someone, decrement that someone's followerCount
            if (String(follow.follower) === userId) {
                bulkUpdates.push({
                    updateOne: {
                        filter: { _id: follow.following },
                        update: { $inc: { followerCount: -1 } }
                    }
                });
            }

            // If someone was following the user, decrement their followingCount
            if (String(follow.following) === userId) {
                bulkUpdates.push({
                    updateOne: {
                        filter: { _id: follow.follower },
                        update: { $inc: { followingCount: -1 } }
                    }
                });
            }
        }

        if (bulkUpdates.length > 0) {
            await USER.bulkWrite(bulkUpdates);
        }

        // Delete the user and related content
        await Promise.all([
            USER.findByIdAndDelete(userId),
            FLICKS.deleteMany({ user: userId }),
            QUESTS.deleteMany({ user: userId }),
            COMMENT.deleteMany({ user: userId }),
            LIKE.deleteMany({ user: userId }),
            FOLLOW.deleteMany({ $or: [{ follower: userId }, { following: userId }] }),
            FEEDBACK.deleteMany({ user: userId }),
            REPORT.deleteMany({ user: userId }),
            SEARCHHISTORY.deleteMany({ user: userId }),
            STORY.deleteMany({ user: userId }),
            STORYVIEW   .deleteMany({ user: userId }),
            USERPREFERENCE.findOneAndDelete({ user: userId }),
            USERBIOLINKS.deleteMany({ user: userId }),
            SESSION.deleteMany({ user: userId }),
            WALLET.findOneAndDelete({ userId: userId }),
        ]);

        return handleResponse(res, 200, success.delete_account);

    } catch (error: any) {
        if (error.code === 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt);
        }
        sendErrorToDiscord("DELETE:delete-account", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
