import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowerUserAggreagtion = async (userId: string, skip: string = "0") => {
    try {
        let response = await FOLLOW.aggregate([
            {
                $match: {
                    follower: new mongoose.Types.ObjectId(userId),
                    approved: true
                },
            },
            {
                $project: {
                    follower: 1,
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
                    localField: "follower",
                    foreignField: "_id",
                    as: "follower",
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
                $project: {
                    FOLLOWERLIST: "$follower"
                }
            }
        ])
        return response[0]
    } catch (error: any) {
        throw error;
    }
}