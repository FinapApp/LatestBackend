import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
}

const TransactionSchema: Schema = new Schema(
    {
      user : { type: Schema.Types.ObjectId, ref: 'user', required: true },
      amount: { type: Number, required: true },
    },
    { timestamps: { createdAt: true }, versionKey: false }
);

TransactionSchema.index({ userId: 1, createdAt: 1 });

export const TRANSACTION = mongoose.model<ITransaction>('transaction', TransactionSchema);
