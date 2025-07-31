import { Request, Response } from 'express';
import { errors, handleResponse } from '../../../utils/responseCodec';
// import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { STORY } from '../../../models/Stories/story.model';
import Joi from 'joi';
import { validateGetFeedback } from '../../../validators/validators';
export const getAllStory = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetFeedback(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const userId = res.locals.userId;

        const pipeline: any[] = [
            // Step 1: Get all users followed by me + myself
            {
                $lookup: {
                    from: "followers",
                    let: { currentUserId: userId },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$follower", "$$currentUserId"] } } },
                        { $project: { _id: 0, following: 1 } }
                    ],
                    as: "followingData"
                }
            },
            {
                $addFields: {
                    followingUserIds: {
                        $concatArrays: [
                            "$followingData.following",
                            [userId] // include myself
                        ]
                    }
                }
            },
            { $unwind: "$followingUserIds" }, // explode into one userId per doc

            // Step 2: Lookup story from each followed user
            {
                $lookup: {
                    from: "stories",
                    let: { followedUserId: "$followingUserIds" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$followedUserId"] },
                                        { $ne: ["$suspended", true] },
                                        // { $lt: ["$expirationTime", new Date()] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } }, // most recent story
                        { $limit: 1 }
                    ],
                    as: "story"
                }
            },
            { $unwind: "$story" },

            // Step 3: Lookup user and song info
            {
                $lookup: {
                    from: "users",
                    localField: "story.user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        { $project: { _id: 1, username: 1, photo: 1  , updatedAt: 1 } }
                    ]
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "songs",
                    localField: "story.song",
                    foreignField: "_id",
                    as: "song",
                    pipeline: [
                        { $project: { _id: 1, name: 1, artist: 1, url: 1, icon: 1, used: 1, duration: 1 } }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$song",
                    preserveNullAndEmptyArrays: true
                }
            },

            // Step 4: Format final result
            {
                $project: {
                    _id: 0,
                    user: "$user",
                    story: {
                        _id: "$story._id",
                        mediaType: "$story.mediaType",
                        url: "$story.url",
                        thumbnailURL: "$story.thumbnailURL",
                        song: "$song",
                        songStart: "$story.songStart",
                        songPosition: "$story.songPosition",
                        audio: "$story.audio",
                        songEnd: "$story.songEnd",
                        caption: "$story.caption",
                        viewCount: "$story.viewCount",
                        hashTags: "$story.hashTags",
                        mention: "$story.mention",
                        expirationTime: "$story.expirationTime",
                        createdAt: "$story.createdAt"
                    }
                }
            },

            { $sort: { "story.createdAt": -1 } },
            {
                $facet: {
                    results: [
                        { $skip: skip },
                        { $limit: Number(limit) }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ];

        const result = await STORY.aggregate(pipeline);
        const stories = result[0]?.results || [];
        const total = result[0]?.totalCount[0]?.count || 0;

        return handleResponse(res, 200, {
            stories,
            totalDocuments: total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
