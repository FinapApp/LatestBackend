import { Request, Response } from "express";
import { errors, handleResponse } from "../../utils/responseCodec";
import { redis } from "../../config/redis/redis.config";
import { config } from "../../config/generalconfig";
import { SONG } from "../../models/Song/song.model";
import { validateGetters } from "../../validators/validators";

interface QueryParams {
    search?: string;
    skip?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

const sortKeyMap: { [key: string]: string } = {
    duration: 'duration'
};

const buildSortOptions = (params: QueryParams) => {
    if (!params.sort) return {};
    const sortField = sortKeyMap[params.sort] || params.sort;
    const sortOrder = params.order === 'desc' ? -1 : 1;
    return { [sortField]: sortOrder }
};


const buildSearchQuery = (params: QueryParams) => {
    const query: any = { suspended: false };
    if (params.search) {
        const searchRegex = new RegExp(params.search, 'i');
        const searchConditions: Array<{ name?: RegExp }> = [
            { name: searchRegex },
        ];
        query.$or = searchConditions;
    }
    return query;
};

const ITEMS_PER_PAGE = config?.ITEMS_PER_PAGE || 10;

export const getAllSongs = async (req: Request, res: Response) => {
    try {
        const validationError = validateGetters(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        const params = req.query as QueryParams
        const userId = res.locals.userId as string;
        const lengthOfQuery = Object.keys(req.query).length;
        if (lengthOfQuery === 0) {
            let cached = await redis.get(`MEDIA-SONGS:${userId}`);
            if (cached) {
                return handleResponse(res, 200, JSON.parse(cached));
            }
        }
        const sortOptions = buildSortOptions(params);
        const skip = parseInt(params.skip || '0');
        const query = buildSearchQuery(params);
        const getSong = await SONG.find(query, "-staff -suspended -suspendedReason", { skip, limit: ITEMS_PER_PAGE, sort: sortOptions });
        const hasMore = getSong.length > ITEMS_PER_PAGE;
        const response = {
            SONGS: getSong.slice(0, ITEMS_PER_PAGE), // Remove extra item from response
            pagination: {
                skip,
                hasMore,
                nextSkip: hasMore ? skip + ITEMS_PER_PAGE : null
            }
        };
        if (lengthOfQuery === 0) {
                await redis.set(
                `MEDIA-SONGS:${userId}`,
                    JSON.stringify(response),
                    "EX",
                    config?.REDIS_EXPIRE_IN
                );
        }
        return handleResponse(res, 200, response);
    } catch (err: any) {
        return handleResponse(res, 500, errors.catch_error, err);
    }
};
