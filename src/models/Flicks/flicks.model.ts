import mongoose, { Document, Schema } from "mongoose";
import { ITextDataSchema, TextDataSchema } from "../Comment/comment.model";

interface IFlicks extends Document {
    user: Schema.Types.ObjectId;
    repost: Schema.Types.ObjectId;
    media: IMediaSchema[];
    location: string;
    gps: {
        type: string;
        coordinates: [number, number];
    };
    thumbnailURL: string;
    description: ITextDataSchema[];
    quest: Schema.Types.ObjectId;
    repostCount: number;
    suspended: boolean;
    song?: Schema.Types.ObjectId;
    songStart?: number;
    songEnd?: number;
    suspendedReason: string;
    commentVisible: boolean;
    likeVisible: boolean;
    commentCount: number;
    likeCount: number;
    commentSetting: string;
    audienceSetting: string;
    repostVisible: boolean;
}

interface TaggedUser {
    user: Schema.Types.ObjectId;
    text: string;
    position?: {
        x: number;
        y: number;
    }
}
// cron to update the text for the collabs needed to be the updated one not immediately affecting anything , on 0:00 every day
const taggedSchema = new Schema<TaggedUser>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        text: { type: String },
        position: {
            x: { type: Number },
            y: { type: Number },
        }
    },
    { versionKey: false, _id: false }
);


export interface IMediaSchema extends Document {
    type: 'video' | 'photo';
    duration?: number;
    audio?: Schema.Types.ObjectId;
    alt: string[];
    thumbnailURL?: string;
    taggedUsers?: TaggedUser[];
    url: string;
}

const MediaSchema = new Schema<IMediaSchema>(
    {
        type: { type: String, enum: ['video', 'photo'] },
        duration: { type: Number },
        audio: { type: Schema.Types.ObjectId, ref: "audio" },
        alt: { type: [String] }, // this is referring to the users search for the best picks for their purpose. gets the user while searching into their metaData for the files 
        taggedUsers: { type: [taggedSchema] }, // it should be changed as per the users
        url: { type: String } // would be the same.
    },
    { versionKey: false, _id: false }
);


export const FlickSchema = new Schema<IFlicks>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        repost: { type: Schema.Types.ObjectId, ref: "flick" },
        media: { type: [MediaSchema] }, // same media when in origin flicks 
        location: { type: String },
        gps: {
            type: { type: String, enum: ["Point"] },
            coordinates: {
                type: [Number],
                index: "2dsphere"
            }
        },
        thumbnailURL: { type: String },
        description: { type: [TextDataSchema] }, // it changes for the  repost
        quest: { type: Schema.Types.ObjectId, ref: 'quest' },
        song: { type: Schema.Types.ObjectId, ref: 'song' },
        songStart: { type: Number },
        songEnd: { type: Number },
        repostCount: { type: Number, default: 0 },
        commentCount: { type: Number, default: 0 },
        likeCount: { type: Number, default: 0 },
        suspended: { type: Boolean, default: false }, 
        suspendedReason: { type: String },
        commentVisible: { type: Boolean, default: true }, // it could be changed
        likeVisible: { type: Boolean, default: true }, // it could be changed
        audienceSetting: { type: String, enum: ['public', 'friends'], default: 'public' }, 
        commentSetting : { type: String, enum: ['everyone', 'friends', 'nobody'], default: 'everyone' }, // when I  want the comments to be controlled by  my user preference , I would change the entire setting of this to be removed from the aggregation pipeline
        repostVisible: { type: Boolean, default: true }, // it could be changed
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

FlickSchema.index({ gps: "2dsphere" });
export const FLICKS = mongoose.model<IFlicks>("flick", FlickSchema);

