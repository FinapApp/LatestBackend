import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllFollowingUserAggreagtion = async (
    userId: string,
    skip: number,
    limit: number,
    viewerId?: string
) => {
    try {
        const pipeline: any[] = [
            {
                $match: {
                    follower: new mongoose.Types.ObjectId(userId),
                    approved: true
                }
            },
            {
                $sort: { createdAt: -1 }
            },
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
            { $unwind: "$followingInfo" }
        ];

        // Add isFollowing check if viewerId is different
        if (viewerId && viewerId !== userId) {
            pipeline.push({
                $lookup: {
                    from: "userfollowers",
                    let: { targetId: "$followingInfo._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$follower", new mongoose.Types.ObjectId(viewerId)] },
                                        { $eq: ["$following", "$$targetId"] },
                                        { $eq: ["$approved", true] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "viewerFollows"
                }
            });
        }

        pipeline.push({
            $project: {
                _id: "$followingInfo._id",
                username: "$followingInfo.username",
                name: "$followingInfo.name",
                photo: "$followingInfo.photo",
                ...(viewerId && viewerId !== userId && {
                    isFollowing: { $gt: [{ $size: "$viewerFollows" }, 0] }
                })
            }
        });

        const response = await FOLLOW.aggregate([
            {
                $facet: {
                    results: pipeline,
                    totalCount: [
                        {
                            $match: {
                                follower: new mongoose.Types.ObjectId(userId),
                                approved: true
                            }
                        },
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
