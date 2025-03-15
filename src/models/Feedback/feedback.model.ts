import { Schema, Types, model } from 'mongoose'

interface IFeedback extends Document {
  _id: string;
  admin: Types.ObjectId;
  user: Types.ObjectId;
  message: IMessage[];
  rating: number;
  status: 'pending' | 'resolved';
}

export interface IMessage {
  sentBy: 'user' | 'admin';
  message: string;
  attachment: string;
}

export const MessageSchema = new Schema<IMessage>(
  {
    sentBy: { type: String, enum: ['user', 'admin'] },
    message: { type: String },
    attachment: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)


let FeedbackSchema = new Schema<IFeedback>(
  {
    admin: {
      type: Schema.Types.ObjectId,
    ref: 'admin',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
    message: {
      type: [MessageSchema],
      require: true,
    },
    rating: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true, versionKey: false }
);

export const FEEDBACK = model<IFeedback>('feedback', FeedbackSchema);
