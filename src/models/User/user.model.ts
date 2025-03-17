import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUserSchema extends Document {
    username: string;
    name: string;
    surname  : string   // added after revisiting the profile screens 
    email: string;
    phone: string;
    password: string;
    dob: string;
    description: string;
    country: string;
    flickCount: number; // Number of flicks user has , increment/decrement when uploading/deleting flicks
    balance: number;
    private: boolean;
    deletedAt: Date;
    gender: string;
    photo: string;
    theme : 'dark' | 'light' | 'system';
    textSize : 'small' | 'medium' | 'large';
    nightMode : boolean;
    warnedCount: number,
    suspended: boolean,
    suspensionReason: string,
}

export const UserSchema = new Schema<IUserSchema>(
    {
        username: { type: String, unique: true },
        name: { type: String },
        surname : {type : String},
        email: { type: String, unique: true },
        phone: { type: String },
        password: { type: String },
        dob: { type: String },
        description: { type: String },
        country: { type: String },
        flickCount: { type: Number },
        balance: { type: Number, default: 0 },
        deletedAt: { type: Date },
        gender: { type: String },
        photo: { type: String },
        private: { type: Boolean, default: false },
        warnedCount: { type: Number, default: 0 },
        theme : { type : String , enum : ['dark' , 'light' , 'system'] , default : 'system'}, // could be shifted to some other places if not this
        textSize : { type : String , enum : ['small' , 'medium' , 'large'] , default : 'medium'}, // could be shifted to some other places if not this.
        nightMode : { type : Boolean , default : false},
        suspended: { type: Boolean, default: false },
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
    } catch (error : any) {
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
        } catch (error : any) {
            return next(error);
        }
    }
    next();
});
export const USER = mongoose.model<IUserSchema>("user", UserSchema);
export type IUser = InstanceType<typeof USER>
