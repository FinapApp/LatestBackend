import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowingUserAggreagtion = async (
    self: mongoose.Types.ObjectId,
    targetUserId: mongoose.Types.ObjectId,
    skip: number,
    limit: number,
) => {
    try {
        const response = await FOLLOW.aggregate([
            {
                $match: {
                    follower: targetUserId,
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
                                localField: "following",
                                foreignField: "_id",
                                as: "followingInfo"
                            }
                        },
                        { $unwind: "$followingInfo" },
                        // Filter out deactivated users
                        {
                            $match: {
                                "followingInfo.isDeactivated": { $ne: true }
                            }
                        },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "userfollowers",
                                let: { followerId: "$followingInfo._id" },
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
                                _id: "$followingInfo._id",
                                username: "$followingInfo.username",
                                name: "$followingInfo.name",
                                photo: "$followingInfo.photo",
                                isFollowing: { $gt: [{ $size: "$isFollowingInfo" }, 0] }
                            }
                        }
                    ],
                    totalCount: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "following",
                                foreignField: "_id",
                                as: "followingInfo"
                            }
                        },
                        { $unwind: "$followingInfo" },
                        // Filter out deactivated users
                        {
                            $match: {
                                "followingInfo.isDeactivated": { $ne: true }
                            }
                        },
                        { $count: "count" }
                    ]
                }
            }
        ]);
        const following = response[0]?.results || [];
        const total = response[0]?.totalCount?.[0]?.count || 0;

        return {
            following,
            totalDocuments: total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(skip / limit) + 1
        };
    } catch (error: any) {
        throw error;
    }
};
