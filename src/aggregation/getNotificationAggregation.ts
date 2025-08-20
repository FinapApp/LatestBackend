import { Types } from 'mongoose';
import { NOTIFICATION } from "../models/User/userNotification.model";

export const getNotificationAggregation = async (userId: string, skip: number, limit: number) => {
    try {
        const result = await NOTIFICATION.aggregate([
            {
                $match: { user: new Types.ObjectId(userId) }
            },
            {
                $facet: {
                    totalCount: [
                        { $count: 'total' }
                    ],
                    notifications: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        // Lookup for user2 (the person who performed the action)
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'user2',
                                foreignField: '_id',
                                as: 'user2Data',
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            photo: 1,
                                            name: 1,
                                            updatedAt: 1,
                                        }
                                    }
                                ]
                            }
                        },
                        // Lookup for follower data
                        {
                            $lookup: {
                                from: 'followers', // Make sure this matches your collection name
                                localField: 'follower',
                                foreignField: '_id',
                                as: 'followerData',
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'follower', // This should be the user field in follower document
                                            foreignField: '_id',
                                            as: 'followerUser',
                                            pipeline: [
                                                {
                                                    $project: {
                                                        _id: 1,
                                                        username: 1,
                                                        photo: 1,
                                                        name: 1,
                                                        updatedAt: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: '$followerUser',
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                    {
                                        $project: {
                                            username: '$followerUser.username',
                                            photo: '$followerUser.photo',
                                            name: '$followerUser.name',
                                            updatedAt: '$followerUser.updatedAt'
                                        }
                                    }
                                ]
                            }
                        },
                        // Lookup for like data
                        {
                            $lookup: {
                                from: 'likes', // Make sure this matches your collection name
                                localField: 'like',
                                foreignField: '_id',
                                as: 'likeData',
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'user',
                                            foreignField: '_id',
                                            as: 'likeUser',
                                            pipeline: [
                                                {
                                                    $project: {
                                                        _id: 1,
                                                        username: 1,
                                                        photo: 1,
                                                        name: 1,
                                                        updatedAt: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: '$likeUser',
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                    {
                                        $project: {
                                            username: '$likeUser.username',
                                            photo: '$likeUser.photo',
                                            name: '$likeUser.name',
                                            updatedAt: '$likeUser.updatedAt'
                                        }
                                    }
                                ]
                            }
                        },
                        // Lookup for flick data
                        {
                            $lookup: {
                                from: 'flicks',
                                localField: 'flick',
                                foreignField: '_id',
                                as: 'flickData',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            thumbnailURL: 1,
                                            user: 1
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'user', // Fixed: removed 'flick.' prefix
                                            foreignField: '_id',
                                            as: 'flickUser',
                                            pipeline: [
                                                {
                                                    $project: {
                                                        _id: 1,
                                                        username: 1,
                                                        name: 1,
                                                        photo: 1,
                                                        updatedAt: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: '$flickUser',
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            thumbnailURL: 1,
                                            user: '$flickUser'
                                        }
                                    }
                                ]
                            }
                        },
                        // Lookup for comment data
                        {
                            $lookup: {
                                from: 'comments',
                                localField: 'comment',
                                foreignField: '_id',
                                as: 'commentData',
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'user',
                                            foreignField: '_id',
                                            as: 'commentUser',
                                            pipeline: [
                                                {
                                                    $project: {
                                                        _id: 1,
                                                        username: 1,
                                                        name: 1,
                                                        photo: 1,
                                                        updatedAt: 1,
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: '$commentUser',
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            comment: 1,
                                            commentUser: 1
                                        }
                                    }
                                ]
                            }
                        },
                        // Lookup for quest data
                        {
                            $lookup: {
                                from: 'quests',
                                localField: 'quest',
                                foreignField: '_id',
                                as: 'questData',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            title: 1,
                                            description: 1,
                                            thumbnailURL: 1,
                                            user: 1
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'user',
                                            foreignField: '_id',
                                            as: 'questUser',
                                            pipeline: [
                                                {
                                                    $project: {
                                                        _id: 1,
                                                        username: 1,
                                                        name: 1,
                                                        photo: 1,
                                                        updatedAt: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: '$questUser',
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            title: 1,
                                            description: 1,
                                            thumbnailURL: 1,
                                            user: '$questUser'
                                        }
                                    }
                                ]
                            }
                        },
                        // Clean up the output structure
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                description: 1,
                                photo: 1,
                                readAt: 1,
                                visited: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                // Flatten the lookup results
                                user2: { $arrayElemAt: ['$user2Data', 0] },
                                follower: { $arrayElemAt: ['$followerData', 0] },
                                like: { $arrayElemAt: ['$likeData', 0] },
                                flick: { $arrayElemAt: ['$flickData', 0] },
                                comment: { $arrayElemAt: ['$commentData', 0] },
                                quest: { $arrayElemAt: ['$questData', 0] }
                            }
                        }
                    ]
                }
            }
        ]);

        const totalCount = result[0]?.totalCount?.[0]?.total || 0;
        const notifications = result[0]?.notifications || [];

        return { totalCount, notifications };
    } catch (err: any) {
        console.error('Error in getNotificationAggregation:', err);
        throw new Error(`Failed to fetch notifications: ${err.message}`);
    }
};


