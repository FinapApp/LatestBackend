import mongoose, { Document, Schema } from "mongoose";

interface IUserBioLinkSchema extends Document {
    user: Schema.Types.ObjectId;
    url: string;
    title: string;
}

export const UserBioLinkSchema = new Schema<IUserBioLinkSchema>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        url: { type: String },
        title: { type: String }
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const USERBIOLINKS = mongoose.model<IUserBioLinkSchema>("userbio", UserBioLinkSchema);
