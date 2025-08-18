import { Schema, model, Types } from 'mongoose';

export interface INotificationSchema extends Document {
    user: Types.ObjectId;
    user2?: Types.ObjectId; // Optional for cases like follow requests where the user is not the one being notified
    flick?: Types.ObjectId;
    comment?: Types.ObjectId;
    like?: Types.ObjectId;
    follower?: Types.ObjectId;
    song?: Types.ObjectId;
    messaging?: Types.ObjectId;
    session?: Types.ObjectId;
    parentComment?: Types.ObjectId; // For comment replies
    title: string;
    description: string;
    photo?: string; // Optional field for media content in notifications
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
            required: false, // Optional for cases like follow requests
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
        parentComment: {
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
        description: { type: String }, // Added description field for more context in notifications
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
