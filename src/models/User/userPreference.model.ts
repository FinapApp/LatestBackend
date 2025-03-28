import mongoose, { Document, Schema } from "mongoose";


export interface IUserPreference extends Document {
    _id: Schema.Types.ObjectId;
    theme: 'dark' | 'light' | 'system'
    textSize: 'small' | 'medium' | 'large'
    nightMode: boolean
    twoFactor: boolean
    twoFactorMethod: 'sms' | 'email'
}

export const UserPreference = new Schema<IUserPreference>(
    {
        _id: { type: Schema.Types.ObjectId, ref: 'user' },
        theme: { type: String, enum: ['dark', 'light', 'system'], default: 'system' },
        textSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
        nightMode: { type: Boolean, default: false },
        twoFactor: { type: Boolean, default: false },
        twoFactorMethod: { type: String, enum: ['sms', 'email'], default: 'email' },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);


export const USERPREFERENCE = mongoose.model<IUserPreference>("userpreference", UserPreference);
