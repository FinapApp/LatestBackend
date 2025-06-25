import { Schema, model } from 'mongoose';


export interface IWalletSchema extends Document {
    user: Schema.Types.ObjectId
    reservedBalance: number; // balance - availableBalance
    availableBalance: number; // balance  - reservedBalance
    stripeAccountId?: string; // optional, for Stripe integration
    stripeReady?: boolean; // optional, for Stripe integration
    currency: 'usd' | 'ca'; // supported currencies
};

const WalletSchema = new Schema<IWalletSchema>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        reservedBalance: {
            type: Number,
            required: true,
            default: 0,
        },
        availableBalance: {
            type: Number,
            required: true,
            default: 0,
        },
        stripeAccountId: {
            type: String,
            default: null, // optional field for Stripe integration
        },
        stripeReady: {
            type: Boolean,
            default: false, // optional field to indicate if Stripe setup is complete
        },
        currency: {
            type: String,
            enum: ['usd', 'ca'], // supported currencies
            default: 'usd', // default currency
        },
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const WALLET = model<IWalletSchema>('wallet', WalletSchema);

