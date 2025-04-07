import mongoose, { Document, Schema } from "mongoose";

export interface IUserFollowerSchema extends Document {
    following: Schema.Types.ObjectId;
    follower: Schema.Types.ObjectId;
    approved: boolean;
}

export const UserFollowerSchema = new Schema<IUserFollowerSchema>(
    {
        follower: { type: Schema.Types.ObjectId, ref: "user" },  // 
        following: { type: Schema.Types.ObjectId, ref: "user" },   // the one who is following someone else
        approved: { type: Boolean, default: true }
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

UserFollowerSchema.index({ following: 1, follower: 1 });

export const FOLLOW = mongoose.model<IUserFollowerSchema>("userfollower", UserFollowerSchema);