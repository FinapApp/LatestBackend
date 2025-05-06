import { Schema, model, Types } from 'mongoose';

export interface ILikeSchema extends Document {
  user: Types.ObjectId;
  flick?: Types.ObjectId;
  comment?: Types.ObjectId;
  quest?: Types.ObjectId;
};

const LikeSchema = new Schema<ILikeSchema>(
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
    quest : {
      type: Schema.Types.ObjectId,
      ref: 'quest',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const LIKE = model<ILikeSchema>('like', LikeSchema);

