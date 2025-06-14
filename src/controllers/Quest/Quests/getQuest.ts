import { Request, Response } from 'express';
import { validateQuestId } from '../../../validators/validators';
import { errors, handleResponse } from '../../../utils/responseCodec';
import Joi from 'joi';
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { QUESTS } from '../../../models/Quest/quest.model';
import { Types } from 'mongoose';
export const getQuest = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateQuestId(req.params);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { questId } = req.params;
        const userId = res.locals.userId;
        const questObjectId = new Types.ObjectId(questId);
        const userObjectId = new Types.ObjectId(userId);
        const pipeline: any[] = [
            { $match: { _id: questObjectId } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                photo: 1,
                                name: 1,
                            }
                        }
                    ]
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "questfavs",
                    let: { questId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$quest", "$$questId"] }
                            }
                        },
                        {
                            $facet: {
                                totalFavorites: [{ $count: "count" }],
                                userFavorite: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$user", userObjectId] }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                favoriteCount: {
                                    $ifNull: [{ $arrayElemAt: ["$totalFavorites.count", 0] }, 0]
                                },
                                isFavorite: {
                                    $gt: [{ $size: "$userFavorite" }, 0]
                                }
                            }
                        },
                        {
                            $project: {
                                favoriteCount: 1,
                                isFavorite: 1
                            }
                        }
                    ],
                    as: "favoriteMeta"
                }
            },
            {
                $addFields: {
                    favoriteCount: { $arrayElemAt: ["$favoriteMeta.favoriteCount", 0] },
                    isFavorite: { $arrayElemAt: ["$favoriteMeta.isFavorite", 0] }
                }
            },
            { $unset: "favoriteMeta" },
            {
                $addFields: {
                    isOwner: { $eq: ["$user._id", userObjectId] }
                }
            },
            {
                $lookup: {
                    from: "questapplications",
                    let: { questId: "$_id", isOwner: "$isOwner" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$quest", "$$questId"] },
                                        { $eq: ["$user", userObjectId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userApplications"
                }
            },
            {
                $addFields: {
                    hasApplied: {
                        $cond: {
                            if: { $eq: ["$isOwner", false] },
                            then: { $gt: [{ $size: "$userApplications" }, 0] },
                            else: false
                        }
                    },
                    hasApproved: {
                        $cond: {
                            if: { $eq: ["$isOwner", false] },
                            then: {
                                $gt: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: "$userApplications",
                                                as: "app",
                                                cond: { $eq: ["$$app.status", "approved"] }
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            else: false
                        }
                    }
                }
            },
            { $unset: ["userApplications", "isOwner"] }
        ];
        const result = await QUESTS.aggregate(pipeline);
        if (!result.length) {
            return handleResponse(res, 404, errors.quest_not_found);
        }
        return handleResponse(res, 200, { questdetails: result[0] });
    } catch (err) {
        console.error(err);
        sendErrorToDiscord("GET:aggregated-quest", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
