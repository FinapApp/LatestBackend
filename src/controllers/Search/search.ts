import { getIndex } from "../../config/melllisearch/mellisearch.config";
import { Request, Response } from "express";
import { errors, handleResponse } from "../../utils/responseCodec";
import Joi from "joi";
import { validateGetSearch } from "../../validators/validators";
import { FOLLOW } from "../../models/User/userFollower.model";
import { QUEST_FAV } from "../../models/Quest/questFavorite.model";
// import { USER } from "../../models/User/user.model";

export const search = async (req: Request, res: Response) => {
    try {
        const validationError: Joi.ValidationError | undefined = validateGetSearch(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        let { q = "", page = 1, type, limit = 5, userId } = req.query as {
            q: string;
            page?: string | number;
            type?: string;
            limit?: string | number;
            userId?: string;
        };

        limit = Number(limit);
        page = Number(page) || 1;
        const offset = (page - 1) * limit;

        const buildResult = (key: string, hits: any[], total: number) => ({
            [key]: hits,
            total,
            page,
            totalPages: Math.ceil(total / limit) || 1
        });

        const result: any = {};

        switch (type) {
            case "user": {
                const index = getIndex("USERS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["userId", "name", "username", "photo"],
                    filter: [
                        `userId != "${res.locals.userId}"`,
                        `isDeactivated != true`
                    ]
                });

                const currentUserFollows = await FOLLOW.find({
                    follower: res.locals.userId,
                    following: { $in: data.hits.map((u: any) => u.userId) }
                }).lean();

                const usersWithFollowStatus = data.hits.map((user: any) => ({
                    ...user,
                    isFollowing: currentUserFollows.some(f => f.following.toString() === user.userId.toString())
                }));

                Object.assign(result, buildResult("users", usersWithFollowStatus, data.estimatedTotalHits));
                break;
            }


            case "following": {
                const targetUserId = userId || res.locals.userId;

                const followings = await FOLLOW.find({ follower: targetUserId }).lean();
                const followingIds = followings.map(f => f.following);

                if (followingIds.length === 0) {
                    Object.assign(result, buildResult("following", [], 0));
                    break;
                }

                const index = getIndex("USERS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    filter: [
                        `userId IN [${followingIds.join(',')}]`,
                        `isDeactivated != true`
                    ],
                    attributesToRetrieve: ["userId", "name", "username", "photo"]
                });

                const currentUserFollows = await FOLLOW.find({
                    follower: res.locals.userId,
                    following: { $in: data.hits.map((u: any) => u.userId) }
                }).lean();

                const usersWithFollowStatus = data.hits.map((user: any) => ({
                    ...user,
                    isFollowing: currentUserFollows.some(f => f.following === user.userId)
                }));

                Object.assign(result, buildResult("following", usersWithFollowStatus, data.estimatedTotalHits));
                break;
            }

            case "follower": {
                const targetUserId = userId || res.locals.userId;

                const followers = await FOLLOW.find({ following: targetUserId }).lean();
                const followerIds = followers.map(f => f.follower);

                if (followerIds.length === 0) {
                    Object.assign(result, buildResult("follower", [], 0));
                    break;
                }

                const index = getIndex("USERS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    filter: [
                        `userId IN [${followerIds.join(',')}]`,
                        `isDeactivated != true`
                    ],
                    attributesToRetrieve: ["userId", "name", "username", "photo"]
                });
                const currentUserFollows = await FOLLOW.find({
                    follower: { $in: data.hits.map((u: any) => u.userId) },
                    following: res.locals.userId
                }).lean();
                console.log(currentUserFollows)
                const usersWithFollowStatus = data.hits.map((user: any) => ({
                    ...user,
                    isFollowing: currentUserFollows.some(f => f.following === user.userId)
                }));
                Object.assign(result, buildResult("follower", usersWithFollowStatus, data.estimatedTotalHits));
                break;
            }

            case "flick": {
                const index = getIndex("FLICKS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["userId", "flickId", "thumbnailURL", "media", "description", "user"]
                });

                let filteredFlick = data.hits.map(flick => {
                    const { media, ...rest } = flick;
                    return {
                        ...rest,
                        media,
                    };
                });

                Object.assign(result, buildResult("flicks", filteredFlick, data.estimatedTotalHits));
                break;
            }

            case "hashtag": {
                const index = getIndex("HASHTAG");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["hashtagId", "value", "count"]
                });
                Object.assign(result, buildResult("hashtag", data.hits, data.estimatedTotalHits));
                break;
            }

            case "quest": {
                const index = getIndex("QUESTS");

                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: [
                        "userId", "questId", "description",
                        "media", "avgAmountPerPerson", "createdAt",
                        "mode", "title", "user"
                    ]
                });

                const questIds = data.hits.map((quest: any) => quest.questId);

                const [questFavorite] = await Promise.all([
                    QUEST_FAV.find({
                        user: res.locals.userId,
                        quest: { $in: questIds }
                    }).lean()
                ]);

                const questFavoriteSet = new Set(questFavorite.map(q => q.quest));

                const quests = data.hits.map((quest: any) => {
                    const isFavorite = questFavoriteSet.has(quest.questId);
                    return {
                        ...quest,
                        isFavorite,
                        thumbnailURLs: undefined
                    };
                });

                Object.assign(result, buildResult("quests", quests, data.estimatedTotalHits));
                break;
            }

            case "song": {
                const index = getIndex("SONGS");
                const data = await index.search(q, {
                    limit,
                    offset,
                    attributesToRetrieve: ["songId", "name", "duration", "icon", "used", "url", "artist"]
                });
                Object.assign(result, buildResult("songs", data.hits, data.estimatedTotalHits));
                break;
            }

            default: {
                const [userSearch, hashTagSearch, questSearch, songSearch] = await Promise.all([
                    getIndex("USERS").search(q, {
                        limit,
                        attributesToRetrieve: ["userId", "name", "username", "photo"],
                        filter: [
                            `userId != ${JSON.stringify(res.locals.userId)}`,
                            // `isDeactivated != true`
                        ]
                    }),
                    getIndex("HASHTAG").search(q, {
                        limit,
                        attributesToRetrieve: ["hashtagId", "value", "count"]
                    }),
                    getIndex("QUESTS").search(q, {
                        limit,
                        attributesToRetrieve: [
                            "userId", "questId", "description", "media",
                            "avgAmountPerPerson", "createdAt", "mode", "title", "user"
                        ]
                    }),
                    getIndex("SONGS").search(q, {
                        limit,
                        attributesToRetrieve: ["songId", "name", "duration", "icon", "used", "url", "artist"]
                    })
                ]);

                result.users = userSearch.hits;
                result.hashtags = hashTagSearch.hits;
                result.quests = questSearch.hits;
                result.songs = songSearch.hits;
                break;
            }
        }

        return handleResponse(res, 200, result);
    } catch (err) {
        console.error(err);
        return handleResponse(res, 500, errors.catch_error);
    }
};
