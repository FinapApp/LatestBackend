import mongoose, { Document, Schema } from "mongoose";
import { ITextDataSchema, TextDataSchema } from "../Comment/comment.model";
interface IFlicks extends Document {
    user: Schema.Types.ObjectId;
    originFlicks: Schema.Types.ObjectId;
    collabs: TaggedUser[];
    media: IMediaSchema[];
    location: string;
    gps: {
        type: string;
        coordinates: [number , number];
    };
    thumbnailURL: string;
    description: ITextDataSchema[];
    quest: Schema.Types.ObjectId;
    repostCount: number;
    suspended: boolean;
    suspendedReason: string;
    commentVisible: boolean;
    likeVisible: boolean;
}
interface TaggedUser {
    user: Schema.Types.ObjectId;
    position: {
        x: number;
        y: number;
    }
}
const taggedAndCollabSchema = new Schema<TaggedUser>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        position: {
            x: { type: Number },
            y: { type: Number },
        }
    },
    { versionKey: false, _id: true }
);


interface IMediaSchema extends Document {
    type: 'video' | 'photo';
    duration?: number;
    audio?: Schema.Types.ObjectId;
    song?: Schema.Types.ObjectId;
    songStart?: number;
    songEnd?: number;
    alt: string;
    songPosition?: {
        x: number;
        y: number
    },
    taggedUsers?: TaggedUser[];
    url: string;
}

const MediaSchema = new Schema<IMediaSchema>(
    {
        type: { type: String, enum: ['video', 'photo'] },
        duration: { type: Number },
        audio: { type: Schema.Types.ObjectId, ref: "audio" },
        song : { type: Schema.Types.ObjectId, ref: "song" },
        songStart: { type: Number },
        songEnd: { type: Number },
        alt: { type: String }, // this 
        songPosition: {
            x: { type: Number },
            y: { type: Number }
        },
        taggedUsers: { type: [taggedAndCollabSchema] },
        url: { type: String }
    },
    { versionKey: false, _id: true }
);


export const FlickSchema = new Schema<IFlicks>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        originFlicks: { type: Schema.Types.ObjectId, ref: "flick" },
        collabs: { type: [taggedAndCollabSchema] },
        media: { type: [MediaSchema] },
        location: { type: String },
        gps: {
            type: { type: String, enum: ["Point"] },
            coordinates: {
                type: [Number],
                index: "2dsphere"
            }
        },
        thumbnailURL: { type: String },
        description: { type: [TextDataSchema] },
        quest: { type: Schema.Types.ObjectId, ref: 'quest' },
        repostCount: { type: Number },
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String },
        commentVisible: { type: Boolean, default: true },
        likeVisible: { type: Boolean, default: true },
    },
    { timestamps: false, versionKey: false }
);
export const FLICKS = mongoose.model<IFlicks>("flick", FlickSchema);
