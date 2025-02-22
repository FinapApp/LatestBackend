import {Schema , Types, model} from 'mongoose'

interface IFeedback {
  _id: string;
  user: Types.ObjectId;
  message: string;
  rating: number;
  status: 'pending' | 'resolved';
}

let FeedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    message: {
      type: String,
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
