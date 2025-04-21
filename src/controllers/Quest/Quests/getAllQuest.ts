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
        const { sort, low, high, mode, type, long, lat, country } = req.query;
        const userId = res.locals.userId;
        const pipeline: any[] = [];
        if(country) {
            pipeline.push({
                $match: {
                    country: country
                }
            })
        }
        if (long && lat) {
            pipeline.unshift({
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [Number(long), Number(lat)]
                    },
                    key: "gps",
                    distanceField: "distanceinKM",
                    distanceMultiplier: 0.001,
                    spherical: true
                }
            });
        }
        if (mode) {
            pipeline.push({
                $match: {
                    mode: mode === 'go' ? 'GoFlick' : 'OnFlick'
                }
            });
        }
        if (low || high) {
            const amountCondition: any = {};
            if (low) {
                amountCondition.$gte = Number(low);
            }
            if (high) {
                amountCondition.$lte = Number(high);
            }
            pipeline.push({
                $match: {
                    avgAmountPerPerson: amountCondition
                }
            });
        }
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
                                                { $eq: ["$user", new Types.ObjectId(userId)] }
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
            case 'self':
                pipeline.push(
                    { $match: { user: new Types.ObjectId(userId) } },
                    {
                        $lookup: {
                            from: "questapplications",
                            localField: "_id",
                            foreignField: "quest",
                            as: "applicants"
                        }
                    },
                    {
                        $addFields: {
                            applicantCount: { $size: "$applicants" }
                        }
                    },
                    {
                        $unset: "applicants"
                    }
                );
                break
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
                                                { $eq: ["$user", new Types.ObjectId(userId)] }
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "applications"
                        }
                    },
                    { $match: { applications: { $ne: [] } } },
                    {
                        $addFields: {
                            totalEarnings: {
                                $sum: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$applications",
                                                as: "app",
                                                cond: { $eq: ["$$app.status", "approved"] }
                                            }
                                        },
                                        as: "approvedApp",
                                        in: "$$approvedApp.txnAmount"
                                    }
                                }
                            }
                        }
                    },
                    { $unset: "applications" }
                );
                break;
        }
        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
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
                        $map: {
                            input: "$media",
                            as: "m",
                            in: "$$m.thumbnailURL"
                        }
                    },
                    totalApproved: 1,
                    totalRejected: 1,
                    leftApproved: 1,
                    maxApplicants: 1,
                    status: 1,
                    createdAt: 1,
                    hasApplied: 1, 
                    isFavorite: 1,
                    applicantCount: 1,
                    avgAmountPerPerson: 1 ,  
                    totalEarnings: 1 
                }
            }
        );
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
                                        { $eq: ["$user", new Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userFavorites"
                }
            },
            {
                $addFields: {
                    isFavorite: { $gt: [{ $size: "$userFavorites" }, 0] }
                }
            },
            { $unset: "userFavorites" }
        );
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
                                        { $eq: ["$user", new Types.ObjectId(userId)] }
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
                    hasApplied: { $gt: [{ $size: "$userApplications" }, 0] }
                }
            },
            { $unset: "userApplications" }
        );
        if (sort) {
            let sortCriteria: any = {};
            switch (sort) {
                case 'date-asc':
                    sortCriteria.createdAt = 1;
                    pipeline.push({ $sort: sortCriteria });
                    break;
                case 'date-desc':
                    sortCriteria.createdAt = -1;
                    pipeline.push({ $sort: sortCriteria });
                    break;
                case 'amount-asc':
                    sortCriteria.avgAmountPerPerson = 1;
                    pipeline.push({ $sort: sortCriteria });
                    break;
                case 'amount-desc':
                    sortCriteria.avgAmountPerPerson = -1;
                    pipeline.push({ $sort: sortCriteria });
                    break;
            }
        }
        const data = await QUESTS.aggregate(pipeline);
        return handleResponse(res, 200, { quests: data });
    } catch (err: any) {
        console.error(err);
        sendErrorToDiscord("GET:all-quests", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};