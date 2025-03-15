import mongoose, { Document, Schema } from "mongoose";

interface IUserFCM extends Document {
    userId: Schema.Types.ObjectId;
    platform: string;
    fcmToken: string;
    createdAt: Date;
}

export const UserFCMTokenSchema = new Schema<IUserFCM>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        platform: { type: String },
        fcmToken: { type: String },
        createdAt: { type: Date, default: Date.now, expires: 7776000 }  //  Expires in  3 months
    },
    { timestamps: false, versionKey: false }
);

export const USERFCM = mongoose.model<IUserFCM>("userfcms", UserFCMTokenSchema);
