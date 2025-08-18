import { Schema, Types, model } from 'mongoose';

export type ICommentSchema = {
    user: Types.ObjectId;
    flick?: Types.ObjectId;
    comment: ITextDataSchema[];
    parentComment?: Types.ObjectId;
    replyCount? : number;
    suspended: boolean;
    suspendedReason: string;
    likeCount: number;
};

export type ITextDataSchema = {
    mention?: Schema.Types.ObjectId
    text?: string
    hashtag?: string
};

export const TextDataSchema = new Schema<ITextDataSchema>(
    {
        mention: {
            type: Schema.Types.ObjectId,    // It gets the latest data from here so basically we need this.
            ref: 'user',
        },
        text: {
            type: String,
            required: true
        },
        hashtag: {
            type: Schema.Types.ObjectId,
            ref: 'hashtag'
        },
    },
    { versionKey: false, _id: false }
);

// concat this to get the text and the handler along with a redirectionLink to the profile


const CommentSchema = new Schema<ICommentSchema>(
        {
            user: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'user', // Someone who does this.
            },
            flick: {
                type: Schema.Types.ObjectId,
                ref: 'flick',  // To which reel he did that.
            },
            comment: {
                type: [TextDataSchema],
                required: true,  // the overall text thingy
            },
            replyCount : {
                type: Number,
                default: 0
            },
            parentComment: {
                type: Schema.Types.ObjectId,
                ref: 'comment', //To which comment of the reel it is
            },
            likeCount: {
                type: Number,
                default: 0
            },
            suspended: {
                type: Boolean,
                default: false
            },
            suspendedReason: {
                type: String
            }
        },
        { timestamps: true, versionKey: false }
    );

CommentSchema.index({ createdAt: -1 })

export const COMMENT = model<ICommentSchema>('comment', CommentSchema);
export type IComment = InstanceType<typeof Comment>;
