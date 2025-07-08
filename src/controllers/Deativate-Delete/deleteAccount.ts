import { Request, Response } from "express";
import { errors, handleResponse, success } from "../../utils/responseCodec";
import { USER } from "../../models/User/user.model";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { FLICKS } from "../../models/Flicks/flicks.model";
import { QUESTS } from "../../models/Quest/quest.model";
import { LIKE } from "../../models/Likes/likes.model";
import { COMMENT } from "../../models/Comment/comment.model";
import { FOLLOW } from "../../models/User/userFollower.model";
import { SEARCHHISTORY } from "../../models/SearchHistory/searchHistory.model";
import { STORY } from "../../models/Stories/story.model";
import { STORYVIEW } from "../../models/Stories/storyView.model";
import { USERPREFERENCE } from "../../models/User/userPreference.model";
import { USERBIOLINKS } from "../../models/User/userBioLinks.model";
import { SESSION } from "../../models/User/userSession.model";
import { WALLET } from "../../models/Wallet/wallet.model";
import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { validateDeleteAccount } from "../../validators/validators";
import bcrypt from "bcryptjs";
import Joi from "joi";
import { DELETEACCOUNT } from "../../models/DeletedAccounts/deleteAccounts.model";

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateDeleteAccount(req.body);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { password, reason = "No reason provided" } = req.body;
        const userId = res.locals.userId;

        // Fetch full user info first
        const user = await USER.findById(userId, "password email username phone createdAt");
        if (!user) {
            return handleResponse(res, 404, errors.user_not_found);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleResponse(res, 400, errors.incorrect_password);
        }

        // Handle follow relationship cleanup
        const follows = await FOLLOW.find({
            $or: [{ follower: userId }, { following: userId }]
        });

        const bulkUpdates: any[] = [];

        for (const follow of follows) {
            if (String(follow.follower) === String(userId)) {
                bulkUpdates.push({
                    updateOne: {
                        filter: { _id: follow.following },
                        update: { $inc: { followerCount: -1 } }
                    }
                });
            }

            if (String(follow.following) === String(userId)) {
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

        // Delete all related content
        await Promise.all([
            USER.findByIdAndDelete(userId),
            FLICKS.deleteMany({ user: userId }),
            QUESTS.deleteMany({ user: userId }),
            COMMENT.deleteMany({ user: userId }),
            LIKE.deleteMany({ user: userId }),
            FOLLOW.deleteMany({ $or: [{ follower: userId }, { following: userId }] }),
            SEARCHHISTORY.deleteMany({ user: userId }),
            STORY.deleteMany({ user: userId }),
            STORYVIEW.deleteMany({ user: userId }),
            USERPREFERENCE.findOneAndDelete({ user: userId }),
            USERBIOLINKS.deleteMany({ user: userId }),
            SESSION.deleteMany({ user: userId }),
            WALLET.findOneAndDelete({ userId }),
        ]);

        const deletionResults = await Promise.allSettled([
            getIndex("FLICKS").deleteDocuments([userId]),
            getIndex("QUESTS").deleteDocuments([userId]),
            getIndex("USERS").deleteDocuments([userId]),
            getIndex("HASHTAG").deleteDocuments([userId]),
        ]);

        for (const result of deletionResults) {
            if (result.status === "rejected") {
                sendErrorToDiscord("DELETE:delete-account", result.reason);
            }
        }

        // Log deleted account info
        await DELETEACCOUNT.create({
            user: userId,
            reason,
            email: user.email,
            username: user.username,
            phone: user.phone,
            accountCreatedAt: user?.createdAt,
        });

        return handleResponse(res, 200, success.delete_account);

    } catch (error: any) {
        if (error.code === 11000) {
            return handleResponse(res, 500, errors.cannot_rerunIt);
        }
        sendErrorToDiscord("DELETE:delete-account", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};

