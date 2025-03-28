import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFriendSuggestionAggregation = async (userId: string) => {
    try {
        const pipeline = [
            {
                $match: { follower: new mongoose.Types.ObjectId(userId) }
            },
            {
                $project: {
                    _id: 0,
                    following: 1
                }
            },
            { $sort: { createdAt: -1 as const} },
            {
                $skip: 0
            },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "users",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                name: 1,
                                photo: 1
                            }
                        }
                    ]
                },
            },
            {
                $project: {
                    users: 1,
                }
            }
        ]
        return await FOLLOW.aggregate(pipeline);
    } catch (error: any) {
        throw error;
    }
};
