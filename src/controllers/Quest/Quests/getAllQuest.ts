import { Request, Response } from "express";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import Joi from "joi";
import { validateGetQuests } from "../../../validators/validators";
import { Types } from "mongoose";

export const getAllQuests = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetQuests(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const currentUserId = new Types.ObjectId(res.locals.userId);
        let { sort, low, high, mode, type, long, lat, country, page, limit = 10, userId } = req.query;

        // Centralized userId logic
        let ownerId: Types.ObjectId = currentUserId;
        if (userId && Types.ObjectId.isValid(userId as string)) {
            ownerId = new Types.ObjectId(userId as string);
        }

        const pipeline: any[] = [];
        limit = Number(limit);
        const skip = ((Number(page) || 1) - 1) * limit;

        // Geolocation stage
        if (long && lat) {
            pipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: [Number(long), Number(lat)] },
                    key: "gps",
                    distanceField: "distanceInMiles",
                    distanceMultiplier: 0.000621371,
                    spherical: true
                }
            });
        }

        pipeline.push({ $match: { status: { $ne: "paused" } } });

        // Country filter
        if (country && typeof country === 'string') {
            country = country.split(",") as string[];
            pipeline.push({ $match: { country: { $in: country } } });
        }

        // Mode filter
        if (mode) {
            pipeline.push({ $match: { mode: mode === 'go' ? 'GoFlick' : 'OnFlick' } });
        }

        // Amount range filter
        if (low || high) {
            const amountCondition: any = {};
            if (low) amountCondition.$gte = Number(low);
            if (high) amountCondition.$lte = Number(high);
            pipeline.push({ $match: { avgAmountPerPerson: amountCondition } });
        }

        // Type-specific filters
        switch (type) {
            case 'favorite':
                pipeline.push(
                    {
                        $lookup: {
                            from: "questfavs",
                            let: { questId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$quest", "$$questId"] },
                                                { $eq: ["$user", ownerId] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "userFavorites"
                        }
                    },
                    { $match: { userFavorites: { $ne: [] } } },
                    { $unset: "userFavorites" }
                );
                break;
            case 'sponsored':
                pipeline.push({ $match: { staff: { $exists: true } } });
                break;
            case 'profile':
                pipeline.push({ $match: { user: ownerId } });
                break;
            case 'applied':
                pipeline.push(
                    {
                        $lookup: {
                            from: "questapplications",
                            let: { questId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$quest", "$$questId"] },
                                                { $eq: ["$user", ownerId] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "applications"
                        }
                    },
                    { $match: { applications: { $ne: [] } } },
                    { $unset: "applications" }
                );
                break;
        }

        // Sorting
        if (sort) {
            const sortCriteria: any = {};
            switch (sort) {
                case 'date-asc': sortCriteria.createdAt = 1; break;
                case 'date-desc': sortCriteria.createdAt = -1; break;
                case 'amount-asc': sortCriteria.avgAmountPerPerson = 1; break;
                case 'amount-desc': sortCriteria.avgAmountPerPerson = -1; break;
            }
            pipeline.push({ $sort: sortCriteria });
        }

        // Results sub-pipeline
        const resultsSubPipeline: any[] = [
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$userId"] },
                                        { $ne: ["$isDeactivated", true] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, name: 1, username: 1, photo: 1 } }
                    ],
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $match: { user: { $ne: null } } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    "user._id": 1,
                    "user.name": 1,
                    "user.photo": 1,
                    "user.username": 1,
                    title: 1,
                    description: 1,
                    totalAmount: 1,
                    mode: 1,
                    location: 1,
                    distanceinKM: 1,
                    thumbnailURLs: {
                        $map: { input: "$media", as: "m", in: "$$m.thumbnailURL" }
                    },
                    totalApproved: 1,
                    totalRejected: 1,
                    leftApproved: 1,
                    maxApplicants: 1,
                    status: 1,
                    createdAt: 1,
                    avgAmountPerPerson: 1
                }
            },
            {
                $lookup: {
                    from: "questfavs",
                    let: { questId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$quest", "$$questId"] },
                                        { $eq: ["$user", ownerId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userFavorites"
                }
            },
            { $addFields: { isFavorite: { $gt: [{ $size: "$userFavorites" }, 0] } } },
            { $unset: "userFavorites" },
            {
                $lookup: {
                    from: "questapplications",
                    let: { questId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$quest", "$$questId"] },
                                        { $eq: ["$user", ownerId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userApplications"
                }
            },
            { $addFields: { hasApplied: { $gt: [{ $size: "$userApplications" }, 0] } } },
            { $unset: "userApplications" }
        ];

        // Additional profile/applied enrichment
        if (type === 'profile') {
            resultsSubPipeline.push(
                {
                    $lookup: {
                        from: "questapplications",
                        localField: "_id",
                        foreignField: "quest",
                        as: "applicants"
                    }
                },
                { $addFields: { applicantCount: { $size: "$applicants" } } },
                { $unset: "applicants" }
            );
        }

        if (type === 'applied') {
            resultsSubPipeline.push(
                {
                    $lookup: {
                        from: "questapplications",
                        let: { questId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$quest", "$$questId"] },
                                            { $eq: ["$user", ownerId] },
                                            { $eq: ["$status", "approved"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "approvedApplications"
                    }
                },
                { $addFields: { totalEarnings: { $sum: "$approvedApplications.txnAmount" } } },
                { $unset: "approvedApplications" }
            );
        }

        pipeline.push({
            $facet: {
                results: resultsSubPipeline,
                totalCount: [{ $count: "count" }]
            }
        });

        const data = await QUESTS.aggregate(pipeline);
        const quests = data[0]?.results || [];
        const total = data[0]?.totalCount[0]?.count || 0;

        return handleResponse(res, 200, {
            quests,
            totalDocuments: total,
            page: Number(page) || 1,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err: any) {
        sendErrorToDiscord("GET:all-quests", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
