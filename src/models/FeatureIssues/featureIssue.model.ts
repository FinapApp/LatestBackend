import { Schema, model, Types } from 'mongoose';


export interface IMessage {
    sentBy: 'user' | 'admin';
    staff: Types.ObjectId;
    message: string;
    attachment: string;
}

const MessageSchema = new Schema<IMessage>(
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

export interface IFeatureIssueSchema extends Document {
    user: Types.ObjectId;
    feature : 'Feed' | 'Story' | 'Profile' | 'Wallet' | 'Search' | 'Notification' | 'Setting' | 'Flick' | 'Quest',
    issueType : 'Bug' | 'Slow Performance' | 'Crash' | 'UI Glitch' | 'Audio Issue' | 'Video Issue' | 'Login Issue' | 'Other',
    message: IMessage[];    
    incidentDate? : Date;
    reportedTo?: Types.ObjectId;
}

let featureIssueSchema = new Schema<IFeatureIssueSchema>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        feature: {
            type: String,
            enum: ['Feed', 'Story', 'Profile', 'Wallet', 'Search', 'Notification', 'Setting', 'Flick', 'Quest'],
            required: true
        },
        issueType: {
            type: String,
            enum: ['Bug', 'Slow Performance', 'Crash', 'UI Glitch', 'Audio Issue', 'Video Issue', 'Login Issue', 'Other'],
            required: true
        },
        incidentDate: {
            type: Date,
        },
        reportedTo: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        message: [MessageSchema],
    },
    { versionKey: false, timestamps: true }
);

export const FEATUREISSUES = model<IFeatureIssueSchema>('featureissue', featureIssueSchema);