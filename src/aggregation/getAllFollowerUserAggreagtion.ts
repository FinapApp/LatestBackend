import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowerUserAggreagtion = async (userId: string, skip: number, limit: number) => {
    try {
        const response = await FOLLOW.aggregate([
            {
                $match: {
                    following: new mongoose.Types.ObjectId(userId),
                    approved: true
                }
            },
            {
                $facet: {
                    results: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "users",
                                localField: "follower",
                                foreignField: "_id",
                                as: "followerInfo"
                            }
                        },
                        { $unwind: "$followerInfo" },
                        // Filter out deactivated users
                        {
                            $match: {
                                "followerInfo.isDeactivated": { $ne: true }
                            }
                        },
                        {
                            $lookup: {
                                from: "userfollowers",
                                let: { followerId: "$followerInfo._id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$follower", new mongoose.Types.ObjectId(userId)] },
                                                    { $eq: ["$following", "$$followerId"] },
                                                    { $eq: ["$approved", true] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: "isFollowingInfo"
                            }
                        },
                        {
                            $project: {
                                _id: "$followerInfo._id",
                                username: "$followerInfo.username",
                                name: "$followerInfo.name",
                                photo: "$followerInfo.photo",
                                isFollowing: { $gt: [{ $size: "$isFollowingInfo" }, 0] }
                            }
                        }
                    ],
                    totalCount: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "follower",
                                foreignField: "_id",
                                as: "followerInfo"
                            }
                        },
                        { $unwind: "$followerInfo" },
                        // Filter out deactivated users for count too
                        {
                            $match: {
                                "followerInfo.isDeactivated": { $ne: true }
                            }
                        },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const followers = response[0]?.results || [];
        const total = response[0]?.totalCount?.[0]?.count || 0;

        return {
            followers,
            totalDocuments: total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(skip / limit) + 1
        };
    } catch (error: any) {
        throw error;
    }
};
