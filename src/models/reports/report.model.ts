import { Schema, model, Types } from 'mongoose';


export interface IMessage {
    sentBy: 'user' | 'admin';
    staff: Types.ObjectId;
    message: string;
    attachment: string;
}

export const MessageSchema = new Schema<IMessage>(
    {
        sentBy: { type: String, enum: ['user', 'admin'] },
        staff: {
            type: Schema.Types.ObjectId,
            ref: 'staff'
        },
        message: { type: String },
        attachment: [{ type: String }],
    },
    { timestamps: { createdAt: true, updatedAt: false }, _id: true, versionKey: false }
)

export interface IReportSchema extends Document {
    user: Types.ObjectId;
    flick?: Types.ObjectId;
    story?: Types.ObjectId;
    audio?: Types.ObjectId;
    quest?: Types.ObjectId;
    comment?: Types.ObjectId;
    reportedTo?: Types.ObjectId;
    message: IMessage[];
    status: 'pending' | 'resolved';
}

let reportSchema = new Schema<IReportSchema>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        flick: {
            type: Schema.Types.ObjectId,
            ref: 'flick',  // report against a flick.
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'comment', // report aginst a comment.
        },
        audio: {
            type: Schema.Types.ObjectId,
            ref: 'audio', // report against an audio.
        },
        story: {
            type: Schema.Types.ObjectId,
            ref: 'story', // report against a story.
        },
        quest: {
            type: Schema.Types.ObjectId,
            ref: 'quest', // report against a quest
        },
        reportedTo: {
            type: Schema.Types.ObjectId,
            ref: 'user',  //report against a user.
        },
        message: {
            type: [MessageSchema],
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
