import { Request, Response } from "express";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { QUESTS } from "../../../models/Quest/quest.model";
// import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import Joi from "joi";
import { validateGetQuests } from "../../../validators/validators";
import { Types } from "mongoose";

export const getAllQuests = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetQuests(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { sort, low, high, mode, type } = req.query;
        const userId = res.locals.userId;
        const pipeline: any[] = [];
        // Handle mode filter
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
        // Handle type filter
        switch (type) {
            case 'sponsored':
                pipeline.push({ $match: { staff: { $exists: true } } });
                break;
            case 'self':
                pipeline.push({ $match: { user: new Types.ObjectId(userId) } });
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
                    { $unset: "applications" }
                );
                break;
        }

        // Lookup user details
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
                    // Include other necessary quest fields
                    title: 1,
                    description: 1,
                    totalAmount: 1,
                    mode: 1,
                    totalApproved: 1,
                    totalRejected: 1,
                    leftApproved: 1,
                    maxApplicants: 1,
                    status: 1,
                    createdAt: 1,
                    // Exclude version key if needed
                }
            }
        );

        // Check if user has applied to the quest
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

        // Apply sorting
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
        // sendErrorToDiscord("GET:all-quests", err);
        return handleResponse(res, 500, errors.catch_error);
    }
};