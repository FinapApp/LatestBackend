import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getFollowers = async (userId: string, skip: string = "0") => {
    try {
        return await FOLLOW.aggregate([
            {
                $match: { follower: new mongoose.Types.ObjectId(userId) }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            { $skip: +skip },
            {
                $lookup: {
                    from: 'users',
                    localField: 'following',
                    foreignField: '_id',
                    as: 'following',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                name: 1,
                                photo: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    follower: 0,
                    following: 1
                }
            }
        ])
    } catch (error: any) {
        throw error;
    }
};