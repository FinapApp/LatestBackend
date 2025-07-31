import mongoose from "mongoose";
import { USER } from "../models/User/user.model";

export const getAllFriendSuggestionAggregation = async (userId: string, skip: number, limit: number) => {
    try {
        const myUserId = new mongoose.Types.ObjectId(userId);

        const response = await USER.aggregate([
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
                $facet: {
                    results: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                username: 1,
                                name: 1,
                                photo: 1,
                                updatedAt: 1,
                            }
                        }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        const suggestedUsers = response[0]?.results || [];
        const total = response[0]?.totalCount?.[0]?.count || 0;

        return {
            suggestedUsers,
            totalDocuments: total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(skip / limit) + 1,
        };
    } catch (error: any) {
        throw error;
    }
};
    