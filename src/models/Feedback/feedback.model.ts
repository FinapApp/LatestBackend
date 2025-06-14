import { Schema, Types, model } from 'mongoose'

interface IFeedback extends Document {
  _id: string;
  staff: Types.ObjectId;
  user: Types.ObjectId;
  message: IMessage[];
  rating: number;
  status: 'pending' | 'resolved';
}

interface IMessage {
  sentBy: 'user' | 'staff';
  message: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    sentBy: { type: String, enum: ['user', 'staff'] },
    message: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false }, _id: true }
)


let FeedbackSchema = new Schema<IFeedback>(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'staff',
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

FeedbackSchema.index({ user: 1, _id: 1 });

export const FEEDBACK = model<IFeedback>('feedback', FeedbackSchema);
