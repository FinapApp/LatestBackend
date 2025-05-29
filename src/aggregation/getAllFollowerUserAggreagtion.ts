import { Types } from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowerUserAggreagtion = async (self: Types.ObjectId, userId: Types.ObjectId, skip: number, limit: number) => {
    try {
        const response = await FOLLOW.aggregate([
            {
                $match: {
                    following: userId,
                    approved: true
                },
            },
            {
                $facet: {
                    results: [
                        { $sort: { createdAt: -1 } },
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
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "userfollowers",
                                let: { followerId: "$followerInfo._id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$follower", self] },
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
