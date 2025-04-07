import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowingUserAggreagtion = async (userId: string, skip: string = "0") => {
    try {
        const response = await FOLLOW.aggregate([
            {
                $match: {
                    follower: new mongoose.Types.ObjectId(userId),
                    approved: true
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
                    localField: "following", // who the user is following
                    foreignField: "_id",
                    as: "followingInfo"
                }
            },
            {
                $unwind: "$followingInfo"
            },
            {
                $project: {
                    _id: 1,
                    username: "$followingInfo.username",
                    name: "$followingInfo.name",
                    photo: "$followingInfo.photo"
                }
            }
        ]);
        return response;
    } catch (error: any) {
        throw error;
    }
};
