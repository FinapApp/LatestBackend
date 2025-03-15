import mongoose, { Document, Schema } from "mongoose";

interface IUserSession extends Document {
    user: Schema.Types.ObjectId;
    refreshToken: string;
    device: string;
    fcmToken: string;
    ip: string;
    os: string;
    location: string;
}

export const UserSessionSchema = new Schema<IUserSession>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        refreshToken: { type: String, required: true },
        device: { type: String },
        fcmToken: { type: String },
        ip: { type: String },
        os: { type: String },
        location: { type: String },
    },
    { timestamps: { createdAt: false, updatedAt: true }, versionKey: false }
);

export const SESSION = mongoose.model<IUserSession>("usersession", UserSessionSchema);
