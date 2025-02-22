import { NOTIFICATION } from "../models/Notification/notification.model"
export const getNotificationAggregation = async (userId: string, skip: string) => {
    try {
        const result = await NOTIFICATION.aggregate([
            {
                $match: { user: userId },
            },
            {
                $facet: {
                    totalCount: [
                        { $count: 'total' }
                    ],
                    notification: [
                        { $sort: { createdAt: -1 } },
                        { $skip: +skip },
                        { $limit: 10 },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'user2',
                                foreignField: '_id',
                                as: 'user',
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            profile: 1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: "flicks",
                                localField: "flick",
                                foreignField: "_id",
                                as: "flick",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            thumbnailURL: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'comments',
                                localField: 'comment',
                                foreignField: '_id',
                                as: 'comment',
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
                                                        name: 1,
                                                        profilePicture: 1
                                                    }
                                                }
                                            ]
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
                    ]
                }
            }
        ])
        const totalCount = result[0]?.totalCount?.[0]?.count || 0; // Handle case where no notifications exist
        const notifications = result[0]?.notifications || [];
        return { totalCount, notifications };
    } catch (err: any) {
        throw err;
    }
} 