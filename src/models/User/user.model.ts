import mongoose, { Document, Schema } from "mongoose";

interface IUserSchema extends Document {
    username: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    dob: string;
    description: string;
    country: string;
    flickCount :  number; // Number of flicks user has , increment/decrement when uploading/deleting flicks
    balance: number;
    private : boolean;
    deletedAt: Date;
    gender: string;
    photo: string;
    warnedCount: number,
    suspended: boolean,
    suspensionReason: string,
}

export const UserSchema = new Schema<IUserSchema>(
    {
        username: { type: String, unique: true },
        name: { type: String },
        email: { type: String, unique: true },
        phone: { type: String},
        password: { type: String },
        dob: { type: String },
        description: { type: String },
        country: {type: String},
        flickCount: { type: Number },
        balance: { type: Number },
        deletedAt: { type: Date },
        gender: { type: String },
        photo: { type: String },
        private : {type  : Boolean , default : false},
        warnedCount: { type: Number },
        suspended: { type: Boolean, default: false },
        suspensionReason: { type: String },
    },
    { timestamps: false, versionKey: false }
);

export const USER = mongoose.model<IUserSchema>("user", UserSchema);
export type IUser = InstanceType<typeof USER>
