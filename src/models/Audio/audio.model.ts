import { Schema, model } from 'mongoose';

export interface IAudioSchema extends Document {
    name: string;
    url: string;
};

const AudioSchema = new Schema<IAudioSchema>(
    {
        url: {
            type: String,
        },
        name : {
            type : String
        }
    },
    { versionKey: false, timestamps: true }
);

export const AUDIO = model<IAudioSchema>('audio', AudioSchema);
