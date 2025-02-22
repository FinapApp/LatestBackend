import { Schema, model, Types } from 'mongoose';

export interface IShareSchema extends Document {
    flick?: Types.ObjectId;
    user: Types.ObjectId;
};

const shareSchema = new Schema<IShareSchema>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        flick: {
            type: Schema.Types.ObjectId,
            ref: 'flick',
        },
    },
    { timestamps: { createdAt: false, updatedAt: true }, versionKey: false }
);

export const SHARES = model<IShareSchema>('Share', shareSchema, 'shares');
