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
    gps: IGPSLocation;
    maxApplicants: number;
    totalAmount: number;
    suspended: boolean;
    suspendedReason : string;
}

export const QuestSchema = new Schema<IQuests>(
    {
        title: { type: String },
        user: { type: Schema.Types.ObjectId, ref: "user" },
        description: { type: String },
        media: { type: [String] },
        mode: { type: String, enum: ['GoFlick', "OnFlick"] },
        location: { type: String },
        gps: {
            type: { type: String },
            coords: {
                type: [Number],
                index: "2dsphere"
            }
        },
        maxApplicants: { type: Number },
        totalAmount: { type: Number },
        suspended: { type: Boolean, default: false },
        suspendedReason : { type : String },
    },
    { timestamps: false, versionKey: false }
);

QuestSchema.index({ gps: "2dsphere" });

export const QUESTS = mongoose.model<IQuests>("quest", QuestSchema);
