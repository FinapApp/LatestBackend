import { Request, Response } from "express";
import Joi from "joi";
import { errors, handleResponse } from "../../utils/responseCodec";
import { sendErrorToDiscord } from "../../config/discord/errorDiscord";
import { validateGetFlickMentions } from "../../validators/validators";
import mongoose from "mongoose";
import { FLICKS } from "../../models/Flicks/flicks.model";

export const getMentionByFlick = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetFlickMentions(req.params, req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { flickId } = req.params;
        const { page = 1, limit = 10, num = 0 } = req.query as {
            page?: string | number;
            limit?: string | number;
            num?: string | number;
        };

        const skip = (Number(page) - 1) * Number(limit);
        const mediaIndex = Number(num);

        const currentUserId = new mongoose.Types.ObjectId(res.locals.userId);
        const flickObjectId = new mongoose.Types.ObjectId(flickId);
        
        const flickDoc = await FLICKS.aggregate([
            { $match: { _id: flickObjectId } },
            {
                $project: {
                    mediaAtIndex: { $arrayElemAt: ['$media', mediaIndex] }
                }
            },
            {
                $project: {
                    taggedUsers: {
                        $ifNull: ['$mediaAtIndex.taggedUsers', []]
                    }
                }
            },
            {
                $addFields: {
                    taggedUserIds: {
                        $map: {
                            input: '$taggedUsers',
                            as: 'tu',
                            in: { $toObjectId: '$$tu.user' }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userIds: '$taggedUserIds' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$userIds'] }
                            }
                        },
                        {
                            $lookup: {
                                from: 'userfollowers',
                                let: { taggedUserId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ['$follower', '$$taggedUserId'] },
                                                    { $eq: ['$following', currentUserId] }
                                                ]
                                            }
                                        }
                                    },
                                    { $project: { _id: 1 } }
                                ],
                                as: 'isFollowedByCurrentUser'
                            }
                        },
                        {
                            $addFields: {
                                isFollowing: {
                                    $gt: [{ $size: '$isFollowedByCurrentUser' }, 0]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                username: 1,
                                photo: 1,
                                isFollowing: 1
                            }
                        },
                        { $skip: skip },
                        { $limit: Number(limit) }
                    ],
                    as: 'taggedUsersEnriched'
                }
            },
            {
                $project: {
                    taggedUsers: 1,
                    taggedUsersEnriched: 1
                }
            }
        ]);


        const result = flickDoc[0];

        if (!result) {
            return handleResponse(res, 404, errors.flick_not_found);
        }

        return handleResponse(res, 200, {
            taggedUsers: result.taggedUsersEnriched || [],
            page: Number(page),
            limit: Number(limit),
            total: result.taggedUsers?.length || 0,
            totalPages: Math.ceil((result.taggedUsers?.length || 0) / Number(limit))
        });

    } catch (error) {
        console.error(error);
        sendErrorToDiscord("GET:get--all-mentions-flick", error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
