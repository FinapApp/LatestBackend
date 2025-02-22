import mongoose, { Document, Schema } from "mongoose";
import { ITextDataSchema, TextDataSchema } from "../Comment/comment.model";
interface IFlicks extends Document {
    user: Schema.Types.ObjectId;
    song: Schema.Types.ObjectId;
    originFlicks: Schema.Types.ObjectId
    videoURL: string;
    photos: string[];
    duration: number;
    suspended: boolean;
    suspendedReason: string;
    hashTags: string[]
    repostCount: number;
    songStart: number;
    songEnd: number;
    audio: Schema.Types.ObjectId;
    description: ITextDataSchema;
    thumbnailURL: string;
    commentVisible: boolean;
    likeVisible: boolean;
    status: boolean;
    alt: string;
    collabs: Schema.Types.ObjectId[];
    taggedUsers: TaggedUser[];
    location: string;
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
    { versionKey: false, _id: false }
);


export const FlickSchema = new Schema<IFlicks>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        song: { type: Schema.Types.ObjectId, ref: "song" },
        originFlicks: { type: Schema.Types.ObjectId, ref: "flick" },
        audio: { type: Schema.Types.ObjectId, ref: "audio" },
        alt: { type: String },
        collabs: { type: [taggedAndCollabSchema] },
        taggedUsers: { type: [taggedAndCollabSchema] },
        videoURL: { type: String },  // Uploaded video link
        location: { type: String },
        thumbnailURL: { type: String }, // Thumbnail of the video
        description: { type: [TextDataSchema] },
        photos: { type: [String] },  // Uploaded photos link
        duration: { type: Number },
        hashTags: { type: [String] },
        repostCount: { type: Number },
        songStart: { type: Number },
        songEnd: { type: Number },
        commentVisible: { type: Boolean, default: true },
        likeVisible: { type: Boolean, default: true },
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String },
    },
    { timestamps: false, versionKey: false }
);
export const FLICKS = mongoose.model<IFlicks>("flick", FlickSchema);
