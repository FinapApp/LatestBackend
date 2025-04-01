import { Schema, model, Types } from 'mongoose';

export interface ISongSchema extends Document {
    staff: Types.ObjectId;
    name: string;
    url: string;
    icon: string;
    used: number;
    duration?: number;
};

const SongSchema = new Schema<ISongSchema>(
    {
        staff: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'staff',
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
    { versionKey: false, timestamps: { updatedAt: false, createdAt: true } }
);

export const SONG = model<ISongSchema>('song', SongSchema);
