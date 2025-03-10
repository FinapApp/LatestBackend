
import mongoose, { Types, Schema } from "mongoose";

export interface IQuestApplication extends Document {
    user: Types.ObjectId;
    quest: Types.ObjectId;
    description?: string;
    media?: {
        url: string;
        type: 'photo' | 'video' | 'audio' | 'pdf';
    }[];
    status: 'pending' | 'approved' | 'rejected';
    partialAllowance: boolean;
    
    suspendedReason: string;
    suspended: boolean;
}

interface Media {
    type: 'photo' | 'video' | 'audio' | 'pdf';
    url: string;
}

const MediaSchema = new Schema<Media>(
    {
        url: { type: String, required: true },
        type: {
            type: String,
            enum: ['photo', 'video', 'audio', 'pdf'],
            required: true,
        },
    },
    { versionKey: false, timestamps: false }
);




const QuestApplicationSchema: Schema<IQuestApplication> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        quest: { type: Schema.Types.ObjectId, ref: 'quest', required: true },
        description: { type: String },
        media: {type: [MediaSchema]},
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        partialAllowance: { type: Boolean, default: false },
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String }
    },
    { timestamps: true, versionKey: false }
);

export const QUEST_APPLICATION = mongoose.model<IQuestApplication>('questapplication', QuestApplicationSchema);