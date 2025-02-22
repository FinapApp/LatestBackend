import { Schema, model, Types } from 'mongoose';

export interface ISongSchema extends Document {
    name: string;
    url: string;
    icon: string;
    user: Types.ObjectId;
    used: number;
    duration?: number;
};

const SongSchema = new Schema<ISongSchema>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'user',
        },
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
        },
        icon: {
            type: String,
            required: true,
        },
        used: {
            type: Number,
            default: 0,
        },
        duration: {
            type: Number,
        },
    },
    { versionKey: false, timestamps: true }
);

export const SONG = model<ISongSchema>('song', SongSchema);
