import mongoose, { Document, Schema } from "mongoose";

interface IUserHashTag extends Document {
    value: string;
    count :  number;
}

export const UserHashTagSchema = new Schema<IUserHashTag>(
    {
        count: { type: Number, default: 1},
        value: { type: String }
    },
    { timestamps: false, versionKey: false }
);

export const HASHTAGS = mongoose.model<IUserHashTag>("hashtag", UserHashTagSchema);
