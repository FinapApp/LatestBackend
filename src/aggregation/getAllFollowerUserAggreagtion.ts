import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowerUserAggreagtion = async (userId: string, skip: number, limit: number) => {
    try {
        const response = await FOLLOW.aggregate([
            {
                $match: {
                    following: new mongoose.Types.ObjectId(userId)
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
                        {
                            $project: {
                                _id: "$followerInfo._id",
                                username: "$followerInfo.username",
                                name: "$followerInfo.name",
                                photo: "$followerInfo.photo"
                            }
                        }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const followers = response[0]?.results || [];
        const total = response[0]?.totalCount[0]?.count || 0;

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
