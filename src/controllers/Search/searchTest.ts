// import { melliClient, userIndex } from "../../config/melllisearch/mellisearch.config"
import { Request, Response } from "express"
import { errors, handleResponse } from "../../utils/responseCodec"

export const searchTest = async (req: Request, res: Response) => {
    try {
        // const [userSearch, flickSearch] = await Promise.all([
        //    userIndex.search(req.body.search, {
        //         limit: 5,
        //         offset: 0,
        //         attributesToRetrieve: ["userId", "name", "username", "photo"],
        //         // filter: 'followerCount > 10', //  for new user removal on search
        //         sort: ['followerCount:desc']
        //     }),
        //     melliClient.index("flicks").search(req.body.search, {
        //         limit: 5,
        //         offset: 0,
        //         attributesToRetrieve: ["userId", "name", "username", "photo"],
        //     })
        // ])
        // const result = {
        //     userSearch: userSearch.hits.map((user) => ({
        //         userId: user.userId,
        //         name: user.name,
        //         username: user.username,
        //         photo: user.photo,
        //     })),
        //     flickSearch: flickSearch.hits.map((flick) => ({
        //         userId: flick.userId,
        //         name: flick.name,
        //         username: flick.username,
        //         photo: flick.photo,
        //     }))
        // }
        // return handleResponse(res, 200, result)
    } catch (err) {
        console.log(err)
        return handleResponse(res, 500, errors.catch_error)
    }
}