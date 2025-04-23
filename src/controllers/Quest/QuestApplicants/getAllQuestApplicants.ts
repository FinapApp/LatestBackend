import { Request, Response } from "express";
import { errors, handleResponse } from "../../../utils/responseCodec";
import { sendErrorToDiscord } from "../../../config/discord/errorDiscord";
import { QUEST_APPLICANT } from "../../../models/Quest/questApplicant.model";
import { validateGetQuestApplicants} from "../../../validators/validators";
import Joi from "joi";
import { Types } from "mongoose";

export const getAllQuestApplicant = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetQuestApplicants(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const { page = 1 } = req.query;
        const limit = 10;
        const skip = (Number(page) - 1) * limit;
        const pipeline: any[] = [
            {
                $match: {
                    quest: new Types.ObjectId(req.params.questId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    createdAt: 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.username": 1,
                    "user.photo": 1,
                },
            },
            {
                $facet: {
                    results: [
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        { $count: "count" }
                    ],
                },
            },
        ];

        const result = await QUEST_APPLICANT.aggregate(pipeline);
        const applicants = result[0]?.results || [];
        const total = result[0]?.totalCount[0]?.count || 0;

        return handleResponse(res, 200, {
            applicants,
            totalDocuments: total,
            page: Number(page),
            totalPages: Math.ceil(total / limit)
        });

    } catch (err: any) {
        sendErrorToDiscord("GET:all-quests-applicant", err);
        return handleResponse(res, 500, { message: "Internal Server Error" });
    }
};
