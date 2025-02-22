import mongoose, { Document, Schema } from "mongoose";

interface IUserHashTag extends Document {
    _id: Schema.Types.ObjectId;
    hashTags: string[];
}

export const UserHashTagSchema = new Schema<IUserHashTag>(
    {
        _id: { type: Schema.Types.ObjectId, ref: "user" },
        hashTags: { type: [String] },
    },
    { timestamps: false, versionKey: false }
);

export const USERHASHTAG = mongoose.model<IUserHashTag>("userhashtag",UserHashTagSchema);
