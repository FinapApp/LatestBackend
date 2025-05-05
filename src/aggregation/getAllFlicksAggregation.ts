import mongoose from "mongoose";
import { FLICKS } from "../models/Flicks/flicks.model";

export const getAllFlicksAggregation = async (userId: string, skip: string = "0") => {
    try {
        const pipeline: any[] = [
            // Initial match to filter relevant documents
            {
                $match: {
                    user: { $ne: new mongoose.Types.ObjectId(userId) },
                    status: false, // it =should be true 
                    suspended: false
                }
            },
            {
                $project: {
                    suspended: 0,
                    suspendedReason: 0,
                }
            },
            // Sort before pagination to maintain consistent order
            { $sort: { createdAt: -1 } },
            // Pagination: Skip and limit early to reduce workload
            { $skip: +skip },
            { $limit: 10 },
            // Lookup for song details with minimal projection
            {
                $lookup: {
                    from: "songs",
                    localField: "song",
                    foreignField: "_id",
                    as: "song",
                    pipeline: [{ $project: { name: 1, url: 1, icon: 1, duration: 1 ,artist: 1 } }]
                }
            },
            // Lookup for user details with optimized follower check
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        // Check if the current user follows this user
                        {
                            $lookup: {
                                from: "followers",
                                let: { creatorId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$following", "$$creatorId"] },
                                                    { $eq: ["$follower", new mongoose.Types.ObjectId(userId)] }
                                                ]
                                            }
                                        }
                                    },
                                    { $limit: 1 }
                                ],
                                as: "followStatus"
                            }
                        },
                        // Convert followStatus to a boolean
                        {
                            $addFields: {
                                follower: { $gt: [{ $size: "$followStatus" }, 0] }
                            }
                        },
                        // Remove unnecessary fields
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                photo: 1,
                                follower: 1
                            }
                        }
                    ]
                }
            },
            // Convert lookup arrays to objects
            {
                $addFields: {
                    song: { $arrayElemAt: ["$song", 0] },
                    user: { $arrayElemAt: ["$user", 0] }
                }
            },
            // Conditional likes lookup with visibility check
            {
                $lookup: {
                    from: "likes",
                    let: { flickId: "$_id", visible: "$likeVisible" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$flick", "$$flickId"] },
                                        { $eq: ["$type", "like"] },
                                        { $eq: ["$$visible", true] } // Skip processing if false
                                    ]
                                }
                            }
                        },
                        { $count: "totalLikes" }
                    ],
                    as: "likes"
                }
            },
            // Conditional comments lookup with visibility check
            {
                $lookup: {
                    from: "comments",
                    let: { flickId: "$_id", visible: "$commentVisible" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$flick", "$$flickId"] },
                                        { $eq: ["$$visible", true] } // Skip processing if false
                                    ]
                                }
                            }
                        },
                        { $count: "totalComments" }
                    ],
                    as: "comments"
                }
            },
            // Add counts conditionally and remove intermediate arrays
            {
                $addFields: {
                    likesCount: {
                        $cond: [
                            { $eq: ["$likeVisible", true] },
                            { $ifNull: [{ $arrayElemAt: ["$likes.totalLikes", 0] }, 0] },
                            "$$REMOVE"
                        ]
                    },
                    commentsCount: {
                        $cond: [
                            { $eq: ["$commentVisible", true] },
                            { $ifNull: [{ $arrayElemAt: ["$comments.totalComments", 0] }, 0] },
                            "$$REMOVE"
                        ]
                    }
                }
            },
            // Final projection to exclude unnecessary fields
            {
                $project: {
                    likes: 0,
                    comments: 0,
                    commentVisible: 0,
                    likeVisible: 0
                }
            }
        ];
        return await FLICKS.aggregate(pipeline);
    } catch (error: any) {
        throw error;
    }
};