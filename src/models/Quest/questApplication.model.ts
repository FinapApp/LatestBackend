
import mongoose, { Types, Schema } from "mongoose";

export interface IQuestApplication extends Document {
    user: Types.ObjectId;
    quest: Types.ObjectId;
    description?: string;
    media?: {
        mediaUrl: string;
        thumbnailUrl?: string;
        mediaType: 'photo' | 'video' | 'audio' | 'pdf';
    }[];
    status: 'pending' | 'approved' | 'rejected';
}




const QuestApplicationSchema: Schema<IQuestApplication> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        quest: { type: Schema.Types.ObjectId, ref: 'quest', required: true },
        description: { type: String },
        media: [
            {
                mediaURL: { type: String, required: true },
                thumbnailURL: { type: String },
                mediaType: {
                    type: String,
                    enum: ['photo', 'video', 'audio', 'pdf'],
                    required: true,
                },
            },
        ],
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    },
    { timestamps: true, versionKey: false }
);

export const QUEST_APPLICATION = mongoose.model<IQuestApplication>('questapplication', QuestApplicationSchema);