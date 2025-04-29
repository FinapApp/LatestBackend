import { Schema, model } from 'mongoose';


export interface IWalletSchema extends Document {
    userId: Schema.Types.ObjectId;
    balance: number; // total balance
    // balance = availableBalance + reservedBalance
    reservedBalance : number; // balance - availableBalance
    availableBalance : number; // balance  - reservedBalance
};

const WalletSchema = new Schema<IWalletSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
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
    },
    { timestamps: true, versionKey: false }
);

export const WALLET = model<IWalletSchema>('wallet', WalletSchema);

