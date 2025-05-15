import mongoose, { Schema } from "mongoose";

interface IStoryView extends Document {
    story: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    viewedAt: Date;
    reaction?: string;
}

const StoryViewSchema: Schema = new Schema<IStoryView>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        story: { type: Schema.Types.ObjectId, ref: 'story', required: true },
        reaction: { type: String },
    },
    { timestamps: {createdAt  : true, updatedAt :  false}, versionKey: false }
);

export const STORYVIEW = mongoose.model<IStoryView>('storyview', StoryViewSchema);