import { Schema, model, Types } from 'mongoose';

export interface ISongSchema extends Document {
    name: string;
    url: string;
    icon: string;
    staff: Types.ObjectId;
    used: number;
    suspended: boolean;
    suspendedReason : string;
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
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String },
    },
    { versionKey: false, timestamps: true },
);

export const SONG = model<ISongSchema>('song', SongSchema);
