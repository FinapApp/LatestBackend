import { Schema, model, Types } from 'mongoose';

export interface ISearchHistorySchema extends Document {
    user: Types.ObjectId
    text: string
    questText?: string
    flick: Types.ObjectId
    userSearched: Types.ObjectId
    quest: Types.ObjectId
    song: Types.ObjectId;
    hashtag: Types.ObjectId;
    createdAt: Date
};

const SearchHistorySchema = new Schema<ISearchHistorySchema>(
    {
        user : {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        questText : {
            type: String,
            required: false,
        },
        text: {
            type: String,
            required: true
        },
        userSearched: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        flick: {
            type: Schema.Types.ObjectId,
            ref: 'flick',
        },
        quest: {
            type: Schema.Types.ObjectId,
            ref: 'quest',
        },
        song: {
            type: Schema.Types.ObjectId,
            ref: 'song'
        },
        hashtag: {
            type: Schema.Types.ObjectId,
            ref: 'hashtag'
        },
        createdAt: {
            type: Date,
        },
    },
    { timestamps: false, versionKey: false }
);

export const SEARCHHISTORY = model<ISearchHistorySchema>('history', SearchHistorySchema);

