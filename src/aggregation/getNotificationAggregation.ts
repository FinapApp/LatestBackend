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
                    notifications: [ // Fixed: Changed 'notification' to 'notifications' for consistency
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
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
                                            photo: 1,
                                            updatedAt: 1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $unwind: {
                                path: '$user',
                                preserveNullAndEmptyArrays: true
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
                            $unwind: {
                                path: '$flick',
                                preserveNullAndEmptyArrays: true
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
                        {
                            $unwind: {
                                path: '$comment',
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]
                }
            }
        ]);

        // Fixed: Corrected property access
        const totalCount = result[0]?.totalCount?.[0]?.total || 0;
        const notifications = result[0]?.notifications || [];

        return { totalCount, notifications };
    } catch (err: any) {
        console.error('Error in getNotificationAggregation:', err);
        throw new Error(`Failed to fetch notifications: ${err.message}`);
    }
};
