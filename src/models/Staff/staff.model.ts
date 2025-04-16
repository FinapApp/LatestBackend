import { Document, Schema } from "mongoose";

interface IStaff extends Document {
    staff: Schema.Types.ObjectId
    username: string;
    address: string;
    phone: string;
    name: string;
    refreshToken: string
    fcmToken: string;
    status: boolean;
    password: string;
    email: string;
    photo: string;
    role: Schema.Types.ObjectId;
}



export const StaffSchema = new Schema<IStaff>(
    {
        staff: { type: Schema.Types.ObjectId, ref: 'staff' },// _d == adminId for superadmin 1st account.
        name: { type: String, required: true },
        username: { type: String, unique: true },
        fcmToken: { type: String },
        refreshToken: { type: String },
        email: { type: String, unique: true },
        phone: { type: String, unique: true },
        address: { type: String },
        password: { type: String },
        photo: { type: String }, //  fetch the data from the url for the s3
        role: { type: Schema.Types.ObjectId, ref: 'role' },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);
