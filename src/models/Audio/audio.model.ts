import { Schema, model } from 'mongoose';

export interface IAudioSchema extends Document {
    name: string;
    url: string;
    duration: number;
    icon : string;
    suspended: boolean;
    suspendedReason: string;
    approved: boolean;
};

const AudioSchema = new Schema<IAudioSchema>(
    {
        name: {
            type: String    
        },
        url: {
            type: String,
        },
        duration: {
            type: Number
        },
        icon : {
            type: String
        },
        approved: {
            type: Boolean,  // Moves to the song collection and be on the marketplace.
            default: false
        },
        suspended: {
            type: Boolean,
            default: false
        },
        suspendedReason: {
            type: String
        }
    },
    { versionKey: false, timestamps: true }
);

export const AUDIO = model<IAudioSchema>('audio', AudioSchema);
