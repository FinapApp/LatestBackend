import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    netAmount: number; // optional field for net amount after fees
    type: 'deposit' | 'transfer' | 'withdrawal' | 'refund' | 'quest'; // type of transaction
    stripeTxnId?: string;
    stripeTransferId?: string; // optional field for Stripe transfer ID
    stripeTransferReversalId?: string; // optional field for Stripe transfer reversal ID
    stripeReversalId?: string; // optional field for Stripe reversal ID
    stripeChargeId?: string; // optional field for Stripe charge ID
    stripeBalanceId?: string; // optional field for Stripe balance transaction ID
    reason?: string; // optional field for the reason of the transaction
    connectedAccountId?: string; // optional field for connected account ID in Stripe
    description?: string; // optional field for transaction description
    metadata?: Record<string, any>; // optional field for additional metadata
    currency: string;
    sourceInfo?: {
        type: string;
        brand?: string;
        last4?: string;
        funding?: string;
        country?: string;
        network?: string;
    }
    destinationBank?: {
        bank_name?: string;
        last4?: string;
        account_holder_name?: string;
        currency?: string;
        country?: string;
        account_type?: string;
    };
    quest?: mongoose.Types.ObjectId; // optional field for quest ID
    status: 'succeeded' | 'pending' | 'failed' | "reversed";
    serviceFee?: number; // optional field for service fee
    transactionFee?: number; // optional field for transaction fee
    date: Date; // date of the transaction
}

const TransactionSchema: Schema = new Schema<ITransaction>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        amount: { type: Number, required: true },  // includes the fees and everything.
        netAmount: { type: Number, default: 0 }, // final amount after fee deduction 
        quest: { type: Schema.Types.ObjectId, ref: 'quest' }, // optional field for quest ID
        type: {
            type: String,
            enum: ['deposit', 'transfer', 'withdrawal', 'refund' , 'quest'],
            required: true,
        },
        serviceFee: { type: Number, default: 0 }, // optional field for service fee
        transactionFee: { type: Number, default: 0 }, // optional field for transaction
        stripeTxnId: { type: String, }, // optional field for Stripe transaction ID
        stripeTransferId: { type: String, }, // optional field for Stripe transfer ID
        stripeTransferReversalId: { type: String, }, // optional field for Stripe transfer reversal ID
        stripeReversalId: { type: String, }, // optional field for Stripe reversal ID
        stripeChargeId: { type: String, }, // optional field for Stripe charge ID
        stripeBalanceId: { type: String, }, // optional field for Stripe balance transaction ID
        reason: { type: String, }, // optional field for the reason of the transaction
        connectedAccountId: { type: String, }, // optional field for connected account ID in Stripe
        description: { type: String, }, // optional field for transaction description
        metadata: { type: Schema.Types.Mixed, default: {} }, // optional field for additional metadata
        destinationBank: {
            type: new Schema({
                bank_name: String,
                last4: String,
                account_holder_name: String,
                currency: String,
                country: String,
                account_type: String,
            }, { _id: false }),
        },
        sourceInfo: {
            type: new Schema({
                type: String,
                brand: String,
                last4: String,
                funding: String,
                country: String,
                network: String,
            }, { _id: false }),

        },
        currency: { type: String, required: true }, // currency of the transaction
        status: {
            type: String,
            enum: ['succeeded', 'pending', 'failed', 'reversed'],
            default: 'succeeded', // default status is succeeded
        },
        date: {
            type: Date,
            default: Date.now, // default date is the current date
        }

    },
    { timestamps: true, versionKey: false }
);

TransactionSchema.index({ user: 1, createdAt: 1 });

export const TRANSACTION = mongoose.model<ITransaction>('transaction', TransactionSchema);
