
import mongoose, { Types, Schema } from "mongoose";

export interface IQuestFav extends Document {
    user: Types.ObjectId;
    quest: Types.ObjectId;
}

const QuestFavoriteSchema: Schema<IQuestFav> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        quest: { type: Schema.Types.ObjectId, ref: 'quest', required: true },
    },
    { timestamps: true, versionKey: false }
);


export const QUEST_FAV = mongoose.model<IQuestFav>('questfav', QuestFavoriteSchema);