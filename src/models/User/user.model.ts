import mongoose, { Document, Schema } from "mongoose";
import { ITextDataSchema, TextDataSchema } from "../Comment/comment.model";

interface IUserSchema extends Document {
    _id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    dob: Date;
    description: ITextDataSchema[];
    country: string;
    flickCount: number;
    successfulQuest: number;
    followingCount: number;
    followerCount: number;
    balance: number;
    private: boolean; // not yet formed
    deletedAt: Date;
    gender: string;
    photo: string;
    theme: 'dark' | 'light' | 'system';
    textSize: 'small' | 'medium' | 'large';
    nightMode: boolean;
    warnedCount: number,
    suspended: boolean,
    suspensionReason: string,
    isDeactivated: boolean,
    deletedReason: string[],
    deactivationReason: string[],
    twoFactor: boolean;
    createdAt: Date;
}

export const UserSchema = new Schema<IUserSchema>(
    {
        username: { type: String, unique: true, lowercase: true },
        name: { type: String },
        email: { type: String, unique: true },
        phone: { type: String , unique: true },
        password: { type: String },
        dob: { type: Date },
        description: { type: [TextDataSchema] },
        country: { type: String },
        balance: { type: Number, default: 0 },
        deletedAt: { type: Date },
        gender: { type: String },
        photo: { type: String },
        private: { type: Boolean, default: false }, // not to be used right now.
        warnedCount: { type: Number, default: 0 },
        flickCount: { type: Number, default: 0 },
        followingCount: { type: Number, default: 0 },
        followerCount: { type: Number, default: 0 },
        suspended: { type: Boolean, default: false },
        isDeactivated: { type: Boolean, default: false },
        deactivationReason: { type: [String] },
        deletedReason: { type: [String] },
        suspensionReason: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);


export const USER = mongoose.model<IUserSchema>("user", UserSchema);
export type IUser = InstanceType<typeof USER>
