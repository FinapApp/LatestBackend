import mongoose, { Document, Schema } from "mongoose";

interface IGPSLocation {
    type: string;
    coords: any;
}

interface IQuests extends Document {
    user: Schema.Types.ObjectId;
    title: string;
    description: string;
    media: string[]
    mode: 'Goflick' | 'OnFlick';
    location: string;
    thumbnailURL: string;
    gps: IGPSLocation;
    maxApplicants: number;
    totalAmount: number;
    suspended: boolean;
    suspendedReason : string;
}

export const QuestSchema = new Schema<IQuests>(
    {
        
        user: { type: Schema.Types.ObjectId, ref: "user" },
        title: { type: String },
        description: { type: String },
        media: { type: [String] },
        mode: { type: String, enum: ['GoFlick', "OnFlick"] },
        location: { type: String },
        gps: {
            type: { type: String, enum : ["Point"] },
            coordinates: {
                type: [Number],
                index: "2dsphere"
            }
        },
        thumbnailURL: { type: String },
        maxApplicants: { type: Number },
        totalAmount: { type: Number },  
        suspended: { type: Boolean, default: false },
        suspendedReason : { type : String },
    },
    { timestamps: false, versionKey: false }    
);

QuestSchema.index({ gps: "2dsphere" });

export const QUESTS = mongoose.model<IQuests>("quest", QuestSchema);
