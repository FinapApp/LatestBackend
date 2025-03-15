import mongoose, { Document, Schema } from "mongoose";

interface IAdmin extends Document {
    username: string;
    password: string;
    email: string;
}

export const AdminSchema = new Schema<IAdmin>(
    {
        username: { type: String, unique: true },
        password: {type : String },
        email:  {type : String , unique : true}
    },
    { timestamps: false, versionKey: false }
);

export const ADMIN = mongoose.model<IAdmin>(
    "admin",
    AdminSchema
);
