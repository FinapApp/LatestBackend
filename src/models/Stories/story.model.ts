import mongoose, { Schema, Document } from 'mongoose';

interface IStory extends Document {
    user: mongoose.Types.ObjectId;
    mediaType: 'photo' | 'video';
    mediaURL: string;
    thumbnailURL: string;
    song?: mongoose.Types.ObjectId;
    songPosition?: {
        x: number;
        y: number
    },
    audio?: mongoose.Types.ObjectId;
    songStart?: number;
    songEnd?: number;
    caption?: string;
    hashTags?: string[];
    viewCount: number;
    suspended: boolean;
    suspendedReason: string;
    expirationTime?: Date;
}

const StorySchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        mediaType: { type: String, enum: ['photo', 'video'] },
        mediaURL: { type: String },
        thumbnailURL: { type: String },
        song: { type: Schema.Types.ObjectId, ref: 'song' },
        songStart: { type: Number },
        songPosition: {
            x: { type: Number },
            y: { type: Number },
        },
        audio: { type: Schema.Types.ObjectId, ref: 'audio' },
        songEnd: { type: Number },
        caption: { type: String },
        viewCount: { type: Number, default: 0 },
        hashTags: { type: [String] },
        suspended: { type: Boolean },
        suspendedReason: { type: String },
        expirationTime: { type: Date, required: true, default: () => new Date(Date.now() + 86400) },
    },
    { timestamps: { createdAt: true }, versionKey: false }
);

StorySchema.index({ userId: 1, createdAt: 1 });

export const STORY = mongoose.model<IStory>('story', StorySchema);
