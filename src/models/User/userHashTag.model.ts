import mongoose, { Document, Schema } from "mongoose";

interface IUserHashTag extends Document {
    hashTag: string;
    hashTagCount :  number;
}

export const UserHashTagSchema = new Schema<IUserHashTag>(
    {
        hashTagCount: { type: Number, default: 0 },
        hashTag: { type: String }
    },
    { timestamps: false, versionKey: false }
);

export const USERHASHTAG = mongoose.model<IUserHashTag>("hashtag", UserHashTagSchema);
