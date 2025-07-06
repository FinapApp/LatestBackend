import { Schema, model } from 'mongoose';


export interface IWalletSchema extends Document {
    user: Schema.Types.ObjectId
    promotionalBalance?: number; // optional, for promotional balance
    totalEarning?: number; // optional, for total earnings
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
        promotionalBalance: {
            type: Number,
            required: false, // optional field for promotional balance
            default: 0, // default value for promotional balance
        },
        // reservedBalance is the balance that is reserved for pending transactions
        reservedBalance: {
            type: Number,
            required: true,
            default: 0,
        },
        // availableBalance is the balance that can be used for transactions
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
        totalEarning: {
            type: Number,
            default: 0, // total earnings from the wallet
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

