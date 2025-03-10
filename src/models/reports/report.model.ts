import { Type } from '@aws-sdk/client-s3';
import { Schema, model, Types } from 'mongoose';
import { IMessage, MessageSchema } from '../Feedback/feedback.model';

export interface IReportSchema extends Document {
    user: Types.ObjectId;
    admin?: Types.ObjectId;
    flick?: Types.ObjectId;
    story? : Types.ObjectId;
    audio? :  Types.ObjectId;
    song? : Types.ObjectId;
    comment?: Types.ObjectId;
    reportedTo?: Types.ObjectId;
    message: IMessage[];
    status: 'pending' | 'resolved';
}

let reportSchema = new Schema<IReportSchema>(
    {
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'admin',
        },
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
        song: {
            type: Schema.Types.ObjectId,
            ref: 'song', // report against a song.
        },
        story  :{
            type: Schema.Types.ObjectId,
            ref: 'story', // report against a story.
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
