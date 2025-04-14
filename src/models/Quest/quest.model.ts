import mongoose, { Document, Schema } from "mongoose";
import { IMediaSchema } from "../Flicks/flicks.model";

interface IGPSLocation {
    type: string;
    coords: any;
}

interface IQuests extends Document {
    user: Schema.Types.ObjectId;
    title: string;
    description: string;
    media: IMediaSchema[];
    mode: 'Goflick' | 'OnFlick';
    location: string;
    thumbnailURL: string;
    gps: IGPSLocation;
    totalAmount: number;
    suspended: boolean;
    suspendedReason: string;
    type: 'Basic' | 'Exclusive'
    maxApplicants: number;
    totalApproved : number;
    totalRejected : number;
    leftApproved :  number;
    status : 'pending' | 'completed' | 'paused';
}

const MediaSchema = new Schema<IMediaSchema>(
    {
        type: { type: String, enum: ['video', 'photo'] },
        duration: { type: Number },
        audio: { type: Schema.Types.ObjectId, ref: "audio" },
        thumbnailURL : { type: String },
        alt: { type: [String] }, 
        url: { type: String }
    },
    { versionKey: false, _id: false  }
);


export const QuestSchema = new Schema<IQuests>(
    {
        type: { type: String, enum: ['Basic', 'Exclusive'] },
        user: { type: Schema.Types.ObjectId, ref: "user" },
        title: { type: String },
        description: { type: String },
        media: { type: [MediaSchema] },
        mode: { type: String, enum: ['GoFlick', "OnFlick"] },
        location: { type: String },
        gps: {
            type: { type: String, enum: ["Point"] },
            coordinates: {
                type: [Number],
                index: "2dsphere"
            }
        },
        thumbnailURL: { type: String },
        totalAmount: { type: Number },
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String },
        maxApplicants: { type: Number },
        totalApproved : { type: Number }, // kafka would be used to update this
        totalRejected : { type: Number }, // kafka would be used to update this
        leftApproved :  { type: Number }, 
        status : { type: String, enum: ['pending', 'completed' , 'paused'], default: 'pending' }
    },
    { timestamps: false, versionKey: false }
);

QuestSchema.index({ gps: "2dsphere" });





export const QUESTS = mongoose.model<IQuests>("quest", QuestSchema);
