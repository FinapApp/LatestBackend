import { Schema, model, Types } from 'mongoose';

export interface INotificationSchema extends Document {
  user: Types.ObjectId;
  user2?: Types.ObjectId;
  flick?: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
  like?: Schema.Types.ObjectId;
  follower?: Schema.Types.ObjectId;
  song?: Schema.Types.ObjectId;
  messaging?: Schema.Types.ObjectId;
  session?: Schema.Types.ObjectId;
  title: string;
  message: string;
  category:
  | 'auth'
  | 'comment'
  | 'story-reaction'
  | 'follower'
  | 'like'
  | 'user'
  | 'reel'
  | 'policy'
  | 'quest'
  | 'messaging';
  readAt?: Date;
  visited?: Boolean;
  createdAt: Date;
  updatedAt: Date;
};

const NotificationSchema = new Schema<INotificationSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    song: {
      type: Schema.Types.ObjectId,
      ref: 'song',
    },
    flick: {
      type: Schema.Types.ObjectId,
      ref: 'flick',
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'follower',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
    like: {
      type: Schema.Types.ObjectId,
      ref: 'like',
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'usersession',
    },
    messaging: { type: Schema.Types.ObjectId, ref: 'messaging' },  // Not required in here
    title: { type: String },
    message: { type: String },
    category: {
      type: String,
      enum: [
        'auth',
        'battle',
        'comment',
        'story-reaction',
        'battle-request',
        'follower',
        'like',
        'user',
        'reel',
        'policy',
        'quest',
        'messaging',
      ],
    },
    readAt: { type: Date },
    visited: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true, versionKey: false }
);

export const NOTIFICATION = model<INotificationSchema>(
  'notification',
  NotificationSchema,
);
