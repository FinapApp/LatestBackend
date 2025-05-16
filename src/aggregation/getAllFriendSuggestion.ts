import mongoose from "mongoose";
import { USER } from "../models/User/user.model";

export const getAllFriendSuggestionAggregation = async (userId: string) => {
    try {
        const myUserId = new mongoose.Types.ObjectId(userId);
        const suggestedUsers = await USER.aggregate([
            { $match: { _id: { $ne: myUserId }, isDeactivated: { $ne: true } } },
            {
                $lookup: {
                    from: 'userfollowers',
                    let: { targetUserId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$follower', myUserId] },
                                        { $eq: ['$following', '$$targetUserId'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'followCheck'
                }
            },
            {
                $match: {
                    followCheck: { $eq: [] }
                }
            },
            {
                $project: {
                    username: 1,
                    name: 1,
                    photo: 1,
                }
            }
        ]);
        return suggestedUsers
    } catch (error: any) {
        throw error;
    }
};
