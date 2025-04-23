import { getIndex } from "../../config/melllisearch/mellisearch.config"
import { Request, Response } from "express"
import { errors, handleResponse } from "../../utils/responseCodec"
import Joi from "joi";
import { validateGetSearch } from "../../validators/validators";

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
                result.userSearch = data.hits.map((user: any) => ({
                    userId: user.userId,
                    name: user.name,
                    username: user.username,
                    photo: user.photo
                }));
                break;
            }
            case "flick": {
                const index = getIndex("FLICKS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["userId", "flickId", "thumbnailURL", "description"]
                });
                result.flickSearch = data.hits.map((flick: any) => ({
                    userId: flick.userId,
                    flickId: flick.flickId,
                    thumbnailURL: flick.thumbnailURL,
                    description: flick.description
                }));
                break;
            }
            case "hashtag": {
                const index = getIndex("HASHTAG");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["hashtagId", "value", "count"]
                });
                result.hashTagSearch = data.hits.map((hashtag: any) => ({
                    hashtagId: hashtag.hashtagId,
                    value: hashtag.value,
                    count: hashtag.count
                }));
                break;
            }
            case "quest": {
                const index = getIndex("QUESTS");
                const data = await index.search(q, {
                    limit,
                    attributesToRetrieve: ["userId", "questId", "description", "thumbnailURL"]
                });
                result.questSearch = data.hits.map((quest: any) => ({
                    userId: quest.userId,
                    questId: quest.questId,
                    description: quest.description,
                    thumbnailURL: quest.thumbnailURL
                }));
                break;
            }
            case "song": {
                const index = getIndex("SONGS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["songId", "title", "artist", "thumbnailURL"]
                });
                result.songSearch = data.hits.map((song: any) => ({
                    songId: song.songId,
                    title: song.title,
                    artist: song.artist,
                    thumbnailURL: song.thumbnailURL
                }));
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
                        attributesToRetrieve: ["userId", "flickId", "thumbnailURL", "description"]
                    }),
                    getIndex("HASHTAG").search(q, {
                        limit,
                        attributesToRetrieve: ["hashtagId", "value", "count"]
                    }),
                    getIndex("QUESTS").search(q, {
                        limit,
                        attributesToRetrieve: ["userId", "questId", "description", "thumbnailURL"]
                    }),
                    getIndex("SONGS").search(q, {
                        limit,
                        attributesToRetrieve: ["songId", "title", "artist", "thumbnailURL"]
                    })
                ]);

                result.userSearch = userSearch;
                result.flickSearch = flickSearch.hits.map((f: any) => ({
                    userId: f.userId,
                    flickId: f.flickId,
                    thumbnailURL: f.thumbnailURL,
                    description: f.description
                }));
                result.hashTagSearch = hashTagSearch.hits.map((h: any) => ({
                    hashtagId: h.hashtagId,
                    value: h.value
                }));
                result.questSearch = questSearch.hits.map((q: any) => ({
                    userId: q.userId,
                    questId: q.questId,
                    description: q.description,
                    thumbnailURL: q.thumbnailURL
                }));
                result.songSearch = songSearch.hits.map((s: any) => ({
                    songId: s.songId,
                    title: s.title,
                    artist: s.artist,
                    thumbnailURL: s.thumbnailURL
                }));
            }
        }
        return handleResponse(res, 200, result)
    } catch (err) {
        console.log(err)
        return handleResponse(res, 500, errors.catch_error)
    }
}