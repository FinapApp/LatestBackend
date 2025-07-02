import { Schema, model } from 'mongoose';


export interface IReferralSchema extends Document {
    user: Schema.Types.ObjectId
    code: string; // code should be unique
    referredUser: Schema.Types.ObjectId
};

const ReferralSchema = new Schema<IReferralSchema>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        code : {
            type: String,
            required: true,
            unique: true, // code should be unique
            trim: true,
            lowercase: true,
        },
        referredUser: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        }
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const REFERRAL = model<IReferralSchema>('referral', ReferralSchema);

