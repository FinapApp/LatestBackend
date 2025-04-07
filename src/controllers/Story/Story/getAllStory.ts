import { Request, Response } from 'express'
import { errors, handleResponse } from '../../../utils/responseCodec';
// import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { STORY } from '../../../models/Stories/story.model';

export const getAllStory = async (req: Request, res: Response) => {
    try {
        let response = await STORY.find({}, "_a", {
            populate: [
                {
                    path: "user",
                    select: "_id username photo"
                },
                {
                    path: "song",
                    select: "_id name artist coverUrl"
                }
            ]
        })
        return handleResponse(res, 200, { stories: response })
    } catch (error) {
        console.error(error)
        // sendErrorToDiscord("GET:get-all-stories", error)
        return handleResponse(res, 500, errors.catch_error)

    }
}