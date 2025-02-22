import mongoose from "mongoose";
import { FOLLOWER } from "../models/User/userFollower.model";

export const getAllFollowingUserAggregation = async (userId: string, skip: string = "0") => {
    try {
        let response = await FOLLOWER.aggregate([
            {
                $match: {
                    follower: new mongoose.Types.ObjectId(userId)
                },
            },
            {
                $project: {
                    following: 1,
                    _id: 0
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: +skip
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "following",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                name: 1,
                                photo: 1
                            }
                        }
                    ]
                }
            },
            {
                $project:{
                    FOLLOWINGLIST: "$following"
                }
            }
        ])
        return response[0]
    } catch (error: any) {
        throw error;
    }
};
