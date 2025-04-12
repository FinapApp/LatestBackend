import { Request, Response } from 'express'
import { errors, handleResponse } from '../../../utils/responseCodec';
// import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { STORY } from '../../../models/Stories/story.model';

export const getAllStory = async (req: Request, res: Response) => {
    try {
        const response = await STORY.aggregate([
            {
                $match: {
                    suspended: { $ne: true },
                    expirationTime: { $gt: new Date() },
                }
            },
            {
                $sort: {
                    expirationTime: 1, // closest to expiring comes first
                    createdAt: 1
                }
            },
            {
                $group: {
                    _id: "$user",
                    story: { $first: "$$ROOT" } // pick the closest-to-expiry story per user
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "story.user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        { $project: { _id: 1, username: 1, photo: 1 } }
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
                        { $project: { _id: 1, name: 1, artist: 1, coverUrl: 1 } }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$song",
                    preserveNullAndEmptyArrays: true
                }
            },
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
            {
                $sort: { "story.expirationTime": 1 }
            }
        ]);

        return handleResponse(res, 200, { stories: response });
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, errors.catch_error);
    }
}
