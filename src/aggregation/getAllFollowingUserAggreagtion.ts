import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowingUserAggreagtion = async (userId: string, skip: number, limit: number) => {
    try {
        const response = await FOLLOW.aggregate([
            {
                $match: {
                    follower: new mongoose.Types.ObjectId(userId),
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
                                localField: "following",
                                foreignField: "_id",
                                as: "followingInfo"
                            }
                        },
                        { $unwind: "$followingInfo" },
                        {
                            $project: {
                                _id: "$followingInfo._id",
                                username: "$followingInfo.username",
                                name: "$followingInfo.name",
                                photo: "$followingInfo.photo"
                            }
                        }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const following = response[0]?.results || [];
        const total = response[0]?.totalCount[0]?.count || 0;

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
