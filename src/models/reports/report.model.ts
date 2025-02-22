import { Schema, model, Types } from 'mongoose';

export interface IReportSchema extends Document {
    user: Types.ObjectId;
    reel?: Types.ObjectId;
    comment?: Types.ObjectId;
    reportedTo?: Types.ObjectId;
    message: string;
    status: 'pending' | 'resolved';
}

let reportSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        flick: {
            type: Schema.Types.ObjectId,
            ref: 'flick',
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'comment',
        },
        reportedTo: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        message: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            enum: ['pending', 'resolved'],
            default: 'pending',
        },
    },
    { versionKey: false, timestamps: true }
);

export const REPORT = model<IReportSchema>('report', reportSchema);
