import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { ITextDataSchema, TextDataSchema } from "../Comment/comment.model";

interface IUserSchema extends Document {
    username: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    dob: Date;
    description: ITextDataSchema[];
    country: string;
    flickCount: number;
    successfulQuest: number;
    followingCount: number;
    followerCount: number;
    balance: number;
    private: boolean; // not yet formed
    deletedAt: Date;
    gender: string;
    photo: string;
    theme: 'dark' | 'light' | 'system';
    textSize: 'small' | 'medium' | 'large';
    nightMode: boolean;
    warnedCount: number,
    suspended: boolean,
    stripeAccountId: string;
    suspensionReason: string,
    isDeactivated: boolean,
    deletedReason: string[],
    deactivationReason: string[],
    twoFactor: boolean
}

export const UserSchema = new Schema<IUserSchema>(
    {   
        username: { type: String, unique: true, lowercase: true, sparse: true },
        name: { type: String },
        email: { type: String, unique: true, sparse: true },
        phone: { type: String, unique: true, sparse: true },
        password: { type: String },
        dob: { type: Date },
        description: { type: [TextDataSchema] },
        country: { type: String },
        balance: { type: Number, default: 0 },
        deletedAt: { type: Date },
        gender: { type: String },
        photo: { type: String },
        private: { type: Boolean, default: false }, // not to be used right now.
        warnedCount: { type: Number, default: 0 },
        flickCount: { type: Number, default: 0 },
        followingCount: { type: Number, default: 0 },
        followerCount: { type: Number, default: 0 },
        suspended: { type: Boolean, default: false },
        stripeAccountId: { type: String },
        isDeactivated: { type: Boolean, default: false },
        deactivationReason: { type: [String] },
        deletedReason: { type: [String] },
        suspensionReason: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);


// Middleware to hash password before saving
UserSchema.pre("save", async function (next) {
    const user = this as IUserSchema;
    if (!user.isModified("password")) return next(); // Only hash if password is modified
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Middleware to hash password before updating
UserSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as Partial<IUserSchema>;

    if (update.password) {
        try {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
            this.setUpdate(update);
        } catch (error: any) {
            return next(error);
        }
    }
    next();
});
export const USER = mongoose.model<IUserSchema>("user", UserSchema);
export type IUser = InstanceType<typeof USER>
