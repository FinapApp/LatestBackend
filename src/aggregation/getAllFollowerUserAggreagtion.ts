import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowerUserAggreagtion = async (userId: string, skip: string = "0") => {
    try {
        const response = await FOLLOW.aggregate([
            {
                $match: {
                    following: new mongoose.Types.ObjectId(userId)
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
                    localField: "follower", // who is following the user
                    foreignField: "_id",
                    as: "followerInfo"
                }
            },
            {
                $unwind: "$followerInfo"
            },
            {
                $project: {
                    _id: "$followerInfo._id",
                    username: "$followerInfo.username",
                    name: "$followerInfo.name",
                    photo: "$followerInfo.photo"
                }
            }
        ]);
        return response;
    } catch (error: any) {
        throw error;
    }
};
