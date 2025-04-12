import mongoose, { Schema, Document } from 'mongoose';

interface IStory extends Document {
    user: mongoose.Types.ObjectId;
    mediaType: 'photo' | 'video';
    url: string;
    thumbnailURL: string;
    song?: mongoose.Types.ObjectId;
    songPosition?: {
        x: number;
        y: number
    },
    audio?: mongoose.Types.ObjectId;
    songStart?: number;
    songEnd?: number;
    mentions?: IMentionSchema[];
    caption?: string;
    hashTags?: IHashTagSchema[];
    viewCount: number;
    suspended: boolean;
    suspendedReason: string;
    expirationTime?: Date;
}

interface IHashTagSchema extends Document {
    hashtag: mongoose.Types.ObjectId;
    position: {
        x: number;
        y: number;
    };
    size: number;
    text: string;
}

interface IMentionSchema extends Document {
    mention: mongoose.Types.ObjectId;
    position: {
        x: number;
        y: number;
    };
    size: number;
    text: string;
}

const hashTagSchema = new Schema<IHashTagSchema>({
    hashtag: { type: Schema.Types.ObjectId, required: true, ref: "hashtag" },
    text: { type: String, required: true },
    size: { type: Number, required: true },
    position : {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    }
}, { _id: false });

const mentionSchema = new Schema<IMentionSchema>({
    mention: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    text: { type: String, required: true },
    size: { type: Number, required: true },
    position : {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    }
}, { _id: false });

const StorySchema: Schema = new Schema<IStory>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        mediaType: { type: String, enum: ['photo', 'video'] },
        url: { type: String , required: true },
        thumbnailURL: { type: String,required :true },
        song: { type: Schema.Types.ObjectId, ref: 'song' },
        songStart: { type: Number },
        songPosition: {
            x: { type: Number },
            y: { type: Number },
        },
        songEnd: { type: Number },
        audio: { type: Schema.Types.ObjectId, ref: 'audio' },
        caption: { type: String },
        viewCount: { type: Number, default: 0 },
        hashTags: { type: [hashTagSchema] },
        mentions: { type: [mentionSchema] },
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String },
        expirationTime: { type: Date, required: true, default: () => new Date(Date.now() + 86400000) }, // for custom expiration time could be 2hrs , 3hrs 6hr (advance time setter if needed to)
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);


export const STORY = mongoose.model<IStory>('story', StorySchema);
