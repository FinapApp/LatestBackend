import { model, Schema } from "mongoose";


export interface ITransactionSchema extends Document {
    userId: Schema.Types.ObjectId;
    date: Date;
    status: 'Pending' | 'Completed' | 'Failed';
    type: 'Credit' | 'Debit';
    transaction_string: string;
    source: string;
    amount: number;
    description: string;
};

const TransactionSchema = new Schema<ITransactionSchema>(
    {
        userId : {
            type : Schema.Types.ObjectId,
            ref : 'user',
            required : true
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            required: true,
        },
        type: {
            type: String,
            enum: ['Credit', 'Debit'],
            required: true,
        },
        transaction_string: {
            type: String,
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true, versionKey: false }
);



export const Transaction = model<ITransactionSchema>('transaction', TransactionSchema, 'transactions');