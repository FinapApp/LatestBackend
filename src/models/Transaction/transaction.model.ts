import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
}

const TransactionSchema: Schema = new Schema(
    {
      
    },
    { timestamps: { createdAt: true }, versionKey: false }
);

TransactionSchema.index({ userId: 1, createdAt: 1 });

export const STORY = mongoose.model<ITransaction>('transaction', TransactionSchema);
