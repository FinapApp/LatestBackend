import { getIndex } from "../../config/melllisearch/mellisearch.config"
import { Request, Response } from "express"
import { errors, handleResponse } from "../../utils/responseCodec"
import Joi from "joi";
import { validateGetSearch } from "../../validators/validators";
import { FOLLOW } from "../../models/User/userFollower.model";

export const search = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetSearch(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }
        let { q, page = 1, type, limit = 5 } = req.query as { q: string; page?: string | number; type?: string, limit?: string | number };
        limit = Number(limit)
        const offset = ((Number(page) || 1) - 1) * limit;
        const result: any = {};
        switch (type) {
            case "user": {
                const index = getIndex("USERS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["userId", "name", "username", "photo"]
                });
                const userIds = data.hits.map((user: any) => user.userId);
                const checkFollowing = await FOLLOW.find({
                    user: res.locals.userId,
                    following: { $in: userIds }
                }).lean(); 
                const followingSet = new Set(checkFollowing.map(f => f.following));
                const usersWithFollowStatus = data.hits.map((user: any) => ({
                    ...user,
                    isFollowing: followingSet.has(user.userId)
                }));
                result.userSearch = usersWithFollowStatus;
                break;
            }
            case "flick": {
                const index = getIndex("FLICKS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["userId", "flickId", "thumbnailURL", "description", "user"]
                });
                result.flickSearch = data.hits
                break;
            }
            case "hashtag": {
                const index = getIndex("HASHTAG");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["hashtagId", "value", "count"]
                });
                result.hashTagSearch = data.hits
                break;
            }
            case "quest": {
                const index = getIndex("QUESTS");
                const data = await index.search(q, {
                    limit,
                    attributesToRetrieve: ["userId", "questId", "description", "thumbnailURLs", "avgAmountPerPerson", "createdAt", "mode", "title", "user"]
                });
                result.questSearch = data.hits
                break;
            }
            case "song": {
                const index = getIndex("SONGS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["songId", "title", "artist", "thumbnailURL"]
                });
                result.songSearch = data.hits
                break;
            }
            default: {
                // Global search (no type filter)
                const [userSearch, flickSearch, hashTagSearch, questSearch, songSearch] = await Promise.all([
                    getIndex("USERS").search(q, {
                        limit,
                        attributesToRetrieve: ["userId", "name", "username", "photo"]
                    }),
                    getIndex("FLICKS").search(q, {
                        limit,
                        attributesToRetrieve: ["userId", "flickId", "thumbnailURL", "description", "user"]
                    }),
                    getIndex("HASHTAG").search(q, {
                        limit,
                        attributesToRetrieve: ["hashtagId", "value", "count"]
                    }),
                    getIndex("QUESTS").search(q, {
                        limit,
                        attributesToRetrieve: ["userId", "questId", "description", "thumbnailURLs", "avgAmountPerPerson", "createdAt", "mode", "title", "user"]
                    }),
                    getIndex("SONGS").search(q, {
                        limit,
                        attributesToRetrieve: ["songId", "name", "duration", "icon" , "used" , "url"]
                    })
                ]);

                result.userSearch = userSearch.hits
                result.flickSearch = flickSearch.hits
                result.hashTagSearch = hashTagSearch.hits
                result.questSearch = questSearch.hits;
                result.songSearch = songSearch.hits
            }
        }
        return handleResponse(res, 200, result)
    } catch (err) {
        console.log(err)
        return handleResponse(res, 500, errors.catch_error)
    }
}