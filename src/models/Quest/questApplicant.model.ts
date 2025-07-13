
import mongoose, { Types, Schema } from "mongoose";
import { ITextDataSchema, TextDataSchema } from "../Comment/comment.model";

export interface IQuestApplicant extends Document {
    user: Types.ObjectId;
    quest: Types.ObjectId;
    description?: ITextDataSchema[];
    media?: Media[];
    status: 'pending' | 'approved' | 'rejected';
    partialAllowance: boolean;
    suspendedReason: string;
    txnId: string;
    txnAmount: number;
    suspended: boolean;
    isDeposited: boolean; // indicates if the deposit has been made
}

interface Media {
    type: 'photo' | 'video' | 'audio' | 'pdf';
    url: string;
    thumbnail: string;
}

const MediaSchema = new Schema<Media>(
    {
        url: { type: String, required: true },
        type: {
            type: String,
            enum: ['photo', 'video', 'audio', 'pdf'],
            required: true,
        },
        thumbnail: { type: String, required: true }
    },
    { versionKey: false, timestamps: false, _id: true }
);

// Uniquely identifier for each one of them to pick which one which should go for in case of a partial allowance , we just share the urls to the flicks if approved and the partial allowance is true. Hosted as Flicks




const QuestApplicantSchema: Schema<IQuestApplicant> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        quest: { type: Schema.Types.ObjectId, ref: 'quest', required: true },
        description: { type: [TextDataSchema] },
        media: { type: [MediaSchema] },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        partialAllowance: { type: Boolean, default: false },
        suspended: { type: Boolean, default: false },
        suspendedReason: { type: String },
        txnId: { type: String },
        txnAmount: { type: Number },
        isDeposited: { type: Boolean, default: false }, // indicates if the deposit has been made
    },
    { timestamps: true, versionKey: false }
);


// right after the approval has being made the quest shifts to the flicks and making this quest owner as the collabs for it.

export const QUEST_APPLICANT = mongoose.model<IQuestApplicant>('questapplication', QuestApplicantSchema);