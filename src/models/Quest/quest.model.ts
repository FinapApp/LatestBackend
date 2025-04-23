import mongoose, { Document, Schema } from "mongoose";
import { IMediaSchema } from "../Flicks/flicks.model";

interface IGPSLocation {
    type: string;
    coords: any;
}

interface IQuests extends Document {
    user: Schema.Types.ObjectId;
    title: string;
    staff : Schema.Types.ObjectId;
    description: string;
    media: IMediaSchema[];
    mode: 'Goflick' | 'OnFlick';
    location: string;
    thumbnailURL: string;
    gps: IGPSLocation;
    totalAmount: number;
    suspended: boolean;
    suspendedReason: string;
    country: string;
    type: 'Basic' | 'Exclusive'
    maxApplicants: number;
    applicantCount : number; // this is the number of applicants that have applied for this quest
    totalApproved : number;
    totalRejected : number;
    leftApproved :  number;
    avgAmountPerPerson: number;
    status : 'pending' | 'completed' | 'paused';
}

const MediaSchema = new Schema<IMediaSchema>(
    {
        type: { type: String, enum: ['video', 'photo'] },
        duration: { type: Number },
        audio: { type: Schema.Types.ObjectId, ref: "audio" },
        thumbnailURL : { type: String },
        alt: { type: [String] }, //this is referring to the descripton search
        url: { type: String }
    },
    { versionKey: false, _id: false  }
);


export const QuestSchema = new Schema<IQuests>(
    {
        type: { type: String, enum: ['Basic', 'Exclusive'] },
        staff : {type :  Schema.Types.ObjectId , ref : "staff"},
        user: { type: Schema.Types.ObjectId, ref: "user" },
        title: { type: String },
        description: { type: String },
        media: { type: [MediaSchema] },
        mode: { type: String, enum: ['GoFlick', "OnFlick"] },
        location: { type: String },
        country : {type : String},
        gps: {
            type: { type: String, enum: ["Point"] },
            coordinates: {
                type: [Number],
                index: "2dsphere"
            }
        },
        totalAmount: { type: Number },
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String },
        maxApplicants: { type: Number },
        applicantCount : { type: Number, default: 0 }, // this is the number of applicants that have applied for this quest
        totalApproved : { type: Number,default : 0 }, // kafka would be used to update this
        totalRejected : { type: Number , default : 0 }, // kafka would be used to update this
        leftApproved :  { 
            type: Number, 
            default: function() { 
                return this.maxApplicants || 0; 
            } 
        }, // kafka would be used to update this
        avgAmountPerPerson: { type: Number, default: function () {
            return this.totalAmount / (this.maxApplicants || 1); // this is the total amount divided by the max applicants
        }}, // this is the total amount divided by the max applicants
        status : { type: String, enum: ['pending', 'completed' , 'paused'], default: 'pending' }
    },
    { timestamps: {createdAt : true , updatedAt : false }, versionKey: false }
);

QuestSchema.index({ gps: "2dsphere" });

export const QUESTS = mongoose.model<IQuests>("quest", QuestSchema);



