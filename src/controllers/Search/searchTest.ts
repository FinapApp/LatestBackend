import { melliClient } from "../../config/melllisearch/mellisearch.config"
import { Request, Response } from "express"
import { errors, handleResponse } from "../../utils/responseCodec"

export const searchTest = async (req: Request, res: Response) => {
    try {
        melliClient.index("users").search(req.body.search, {
            limit: 10,
            offset: 0,
            attributesToHighlight: ['username', 'name', 'description'],
            attributesToCrop: ['username', 'name', 'description'],
            cropLength: 50,
            highlightPreTag: '<mark>',
            highlightPostTag: '</mark>',
            filter: 'followerCount > 10',
            sort: ['followerCount:desc']
        }).then((result) => {
            console.log(result)
            return handleResponse(res, 200, result)
        }
        ).catch((err) => {
            console.log(err)
            return handleResponse(res, 500, errors.catch_error)
        })
    } catch (err) {
        console.log(err)
        return handleResponse(res, 500, errors.catch_error)
    }
}