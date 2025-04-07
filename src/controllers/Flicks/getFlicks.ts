import { Request, Response } from 'express'
import { validateGetAllFlicks } from '../../validators/validators';
import Joi from 'joi';
import { errors, handleResponse } from '../../utils/responseCodec';
import { FLICKS } from '../../models/Flicks/flicks.model';
import { redis } from '../../config/redis/redis.config';
import { sendErrorToDiscord } from '../../config/discord/errorDiscord';

export const getAllFlicks = async (req: Request, res: Response) => {
    try {

        //  IT IS OF THE HOME PAGE
        const validationError: Joi.ValidationError | undefined = validateGetAllFlicks(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        // const user = res.locals.userId

        //FOR TESTING THEIR OWN FLICKS  // REMOVE WHEN AGGREGATION IS BEING DONE
        const getFlicks = await FLICKS.find({}, "-updatedAt", {
            populate: [
                { path: 'user', select: 'username photo' }, //check whether I follow this guy or not ? 
                // { path: 'originFlicks', select: 'user' }, // link to the original flick
                { path: 'media.audio', select: 'name url' },
                // { path: 'media.song', select: 'name  url' },
                { path: 'media.taggedUsers.user', select: 'username photo' },
                { path: 'collabs.user', select: 'username photo' },
                { path: 'quest', select: 'name' },
                { path: 'media.taggedUsers.user', select: 'username photo' },
                { path: "description.mention", select: "username" },
            ],
            lean: true
        })
        if (!getFlicks) {
            return handleResponse(res, 304, errors.no_flicks)
        }
        // let response = await getAllFlicksAggregation(user, req.query.params as string)
        // if(!response){
        //     return handleResponse(res, 304, errors.no_flicks)
        // }
        const likeData = await Promise.all(
            getFlicks.map(flick =>
                redis.hgetall(`flick:likes:${flick._id}`)
            )
        );
        const commentData = await Promise.all(
            getFlicks.map(flick =>
                redis.hgetall(`flick:comments:${flick._id}`)
            )
        );
        const mergedFeed = getFlicks.map((flick, idx) => (
            {
                ...flick,
                likeCount: Number(likeData[idx]?.count || flick.likeCount || 0),
                commentCount: Number(commentData[idx]?.count || flick.commentCount || 0),
            }));
        return handleResponse(res, 200, { flicks: mergedFeed })
    } catch (error) {
        sendErrorToDiscord("GET:get-all-flicks", error)
        return handleResponse(res, 500, errors.catch_error)
    }
}