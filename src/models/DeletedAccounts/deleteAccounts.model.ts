import { Schema, Types, model } from 'mongoose';

export type IDeletedAccount = {
    user: Types.ObjectId;
    reason: string; 
    email: string; // Optional field for email, if needed
    username : string;
    phone?: string; // Optional field for phone number, if needed
    accountCreatedAt: Date;
};


const DeleteAccountSchema = new Schema<IDeletedAccount>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'user', // Someone who does this.
        },
        reason: {
            type: String,
            required: true, // Reason for account deletion
            minlength: 2, // Minimum length for the reason
            maxlength: 200, // Maximum length for the reason
        },
        email: {
            type: String,
            required: false, // Optional field for email
        },
        username: {
            type: String,
            required: true, // Username of the user
        },
        phone: {
            type: String,
            required: false, // Optional field for phone number
        },
        accountCreatedAt: {
            type: Date,
            required: true, // Date when the account was created
            default: Date.now, // Default to current date if not provided
        }, 
    },
    { timestamps: true, versionKey: false }
);

DeleteAccountSchema.index({ createdAt: -1 })

export const DELETEACCOUNT = model<IDeletedAccount>('comment', DeleteAccountSchema);
