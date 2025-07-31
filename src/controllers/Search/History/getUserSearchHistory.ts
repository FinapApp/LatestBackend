import { Request, Response } from 'express';
import Joi from 'joi';
import { errors, handleResponse } from '../../../utils/responseCodec';
import { sendErrorToDiscord } from '../../../config/discord/errorDiscord';
import { validateGetSearchHistory } from '../../../validators/validators';
import { SEARCHHISTORY } from '../../../models/SearchHistory/searchHistory.model';
import mongoose from 'mongoose';

export const getUserSearchHistory = async (req: Request, res: Response) => {
    try {
        // Validate query parameters
        const validationError: Joi.ValidationError | undefined = validateGetSearchHistory(req.query);
        if (validationError) {
            return handleResponse(res, 400, errors.validation, validationError.details);
        }

        const currentUserId = new mongoose.Types.ObjectId(res.locals.userId);

        // Parse and set default pagination params
        let { limit = 10, page = 1, type } = req.query as {
            limit?: string | number;
            page?: string | number;
            type?: 'userSearched' | 'flick' | 'quest' | 'song' | 'hashtag' | 'questText';
        };

        limit = Number(limit);
        page = Number(page);
        const skip = (page - 1) * limit;

        // Construct initial match stage for current user
        const pipeline: any[] = [
            {
                $match: {
                    user: currentUserId,
                },
            },
        ];

        // Define filters for type parameter
        const typeFilters: Record<string, any> = {
            userSearched: { userSearched: { $exists: true } },
            flick: { flick: { $exists: true } },
            quest: {
                $or: [
                    { quest: { $exists: true } },
                    { questText: { $exists: true } }
                ]
            },
            questText: { questText: { $exists: true } },
            song: { song: { $exists: true } },
            hashtag: { hashtag: { $exists: true } },
        };

        // Apply type filter if provided
        if (type && typeFilters[type]) {
            pipeline.push({ $match: typeFilters[type] });
        }

        // Sort by createdAt descending to get latest entries first for grouping
        pipeline.push({ $sort: { createdAt: -1 } });

        // Group by `text` field to get unique latest entries
        pipeline.push({
            $group: {
                _id: "$text",
                doc: { $first: "$$ROOT" }, // keep the entire latest document per unique text
            },
        });

        // Replace root with document to continue aggregation pipeline normally
        pipeline.push({ $replaceRoot: { newRoot: "$doc" } });

        // Populate references with lookup and unwind
        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'userSearched',
                    foreignField: '_id',
                    as: 'userSearched'
                }
            },
            { $unwind: { path: '$userSearched', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'flicks',
                    localField: 'flick',
                    foreignField: '_id',
                    as: 'flick'
                }
            },
            { $unwind: { path: '$flick', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'quests',
                    localField: 'quest',
                    foreignField: '_id',
                    as: 'quest'
                }
            },
            { $unwind: { path: '$quest', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtag',
                    foreignField: '_id',
                    as: 'hashtag'
                }
            },
            { $unwind: { path: '$hashtag', preserveNullAndEmptyArrays: true } }
        );

        // Sort again by createdAt descending to keep ordering for pagination
        pipeline.push({ $sort: { createdAt: -1 } });

        // Apply facet for pagination and total count
        pipeline.push({
            $facet: {
                results: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: 'count' }],
            }
        });

        const result = await SEARCHHISTORY.aggregate(pipeline);

        const searchHistory = result[0]?.results || [];
        const totalCount = result[0]?.totalCount?.[0]?.count || 0;

        if (!searchHistory.length) {
            return handleResponse(res, 404, errors.search_history_not_found);
        }

        return handleResponse(res, 200, {
            searchHistory,
            totalDocuments: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (error) {
        console.error(error);
        sendErrorToDiscord('GET:user-search-history', error);
        return handleResponse(res, 500, errors.catch_error);
    }
};
