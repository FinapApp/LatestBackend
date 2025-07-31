import mongoose from "mongoose";
import { FOLLOW } from "../models/User/userFollower.model";

export const getAllStoriesAggregation = async (userId: string) => {
    try {
        const pipeline: any[] = [
            // Step 1: Find the users I follow
            {
                $match: {
                    follower: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: null,
                    followingUsers: { $addToSet: "$following" }
                }
            },
            {
                $project: {
                    _id: 0,
                    followingUsers: 1
                }
            },

            // Step 2: Fetch "My Stories" and "User Stories" separately
            {
                $facet: {
                    myStories: [
                        {
                            $lookup: {
                                from: "stories",
                                pipeline: [
                                    {
                                        $match: {
                                            user: new mongoose.Types.ObjectId(userId),
                                            status: true,
                                            suspended: false
                                        }
                                    },
                                    { $sort: { createdAt: -1 } }
                                ],
                                as: "stories"
                            }
                        },
                        { $unwind: "$stories" },
                        { $replaceRoot: { newRoot: "$stories" } }
                    ],
                    userStories: [
                        {
                            $lookup: {
                                from: "stories",
                                let: { userIds: "$followingUsers" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $in: ["$user", "$$userIds"] },
                                            status: true,
                                            suspended: false
                                        }
                                    },
                                    { $sort: { createdAt: -1 } }
                                ],
                                as: "stories"
                            }
                        },
                        { $unwind: "$stories" },
                        { $replaceRoot: { newRoot: "$stories" } }
                    ]
                }
            },

            // Step 3: Process each story with user details, song, and views count
            {
                $facet: {
                    myStories: [
                        { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
                        { $addFields: { user: { $arrayElemAt: ["$user", 0] } } },
                        { $lookup: { from: "songs", localField: "song", foreignField: "_id", as: "song" } },
                        { $addFields: { song: { $arrayElemAt: ["$song", 0] } } },
                        {
                            $lookup: {
                                from: "storyviews",
                                let: { storyId: "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$storyId", "$$storyId"] } } },
                                    { $count: "totalViews" }
                                ],
                                as: "views"
                            }
                        },
                        { $addFields: { viewsCount: { $ifNull: [{ $arrayElemAt: ["$views.totalViews", 0] }, 0] } } },
                        {
                            $project: {
                                _id: 1, createdAt: 1, mediaType: 1, mediaUrl: 1, thumbnail: 1, caption: 1, hashTags: 1,
                                user: { _id: 1, username: 1, photo: 1 , updatedAt: 1 },
                                song: { name: 1, url: 1, icon: 1, duration: 1 , artist: 1 },
                                viewsCount: 1
                            }
                        }
                    ],
                    userStories: [
                        { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
                        { $addFields: { user: { $arrayElemAt: ["$user", 0] } } },
                        { $lookup: { from: "songs", localField: "song", foreignField: "_id", as: "song" } },
                        { $addFields: { song: { $arrayElemAt: ["$song", 0] } } },
                        {
                            $lookup: {
                                from: "storyviews",
                                let: { storyId: "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$storyId", "$$storyId"] } } },
                                    { $count: "totalViews" }
                                ],
                                as: "views"
                            }
                        },
                        { $addFields: { viewsCount: { $ifNull: [{ $arrayElemAt: ["$views.totalViews", 0] }, 0] } } },
                        {
                            $project: {
                                _id: 1, createdAt: 1, mediaType: 1, mediaUrl: 1, thumbnail: 1, caption: 1, hashTags: 1,
                                user: { _id: 1, username: 1, photo: 1 , updatedAt: 1 },
                                song: { name: 1, url: 1, icon: 1, duration: 1 },
                                viewsCount: 1
                            }
                        }
                    ]
                }
            }
        ];
        return await FOLLOW.aggregate(pipeline);
    } catch (error: any) {
        throw error;
    }
};
