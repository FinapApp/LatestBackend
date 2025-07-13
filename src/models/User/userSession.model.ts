import mongoose, { Document, Schema } from "mongoose";

interface IUserSession extends Document {
    user: Schema.Types.ObjectId;
    refreshToken: string;
    device: string;
    fcmToken: string;
    gps: {
        type: string;
        coordinates: number[];
    };
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
        gps : {
            type: { type: String, enum: ["Point"] ,  default: "Point" },
            coordinates: {
                type: [Number],
            }
        },
        ip: { type: String },
        os: { type: String },
        location: { type: String },
    },
    { timestamps: { createdAt: true , updatedAt: false }, versionKey: false }
);

UserSessionSchema.index({ gps: "2dsphere" });

export const SESSION = mongoose.model<IUserSession>("usersession", UserSessionSchema);
