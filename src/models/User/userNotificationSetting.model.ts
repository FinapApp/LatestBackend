import { Schema, model, Types } from 'mongoose';

export interface IShareSchema extends Document {
    _id?: Types.ObjectId;
    pauseAll: boolean;
    likes : "everyone" | "following" | "none";
    comments : "everyone" | "following" | "none";
    tagged : "everyone" | "following" | "none";
    addToPost : "everyone" | "following" | "none";
    storyReaction : "everyone" | "following" | "none";
    storyComment : "everyone" | "following" | "none";
    storyTagged : "everyone" | "following" | "none";
    message : "everyone" | "following" | "none";
    messageRequest : "everyone" | "following" | "none";
    messageRequestGroup : "everyone" | "following" | "none";
    newFollower : "everyone" | "following" | "none";
    newFollowing : "everyone" | "following" | "none";
    acceptedFollower : "everyone" | "following" | "none";
    suggestedFollower : "everyone" | "following" | "none";
    profileMention : "everyone" | "following" | "none";
    audioCall : "everyone" | "following" | "none";
    videoCall : "everyone" | "following" | "none";
    liveVideoStart : "everyone" | "following" | "none";
    liveVideoEnd : "everyone" | "following" | "none";
    recentlyUploaded : "everyone" | "following" | "none";
    repost : "everyone" | "following" | "none";
    audio : "everyone" | "following" | "none";
    mostWatched  : "everyone" | "following" | "none";
    createdAQuest : ["all" | "everyone" | "following" | "goflick" |  "onflick" | "none"];
    sponsoredQuest : ["all" | "goflick" |  "onflick" | "node"];
    appliedForQuest : "everyone" | "following" | "none";
    likedQuest : "everyone" | "following" | "none";
    questUpdates : "everyone" | "following" | "none";
    creditedTxn : "everyone" | "following" | "none";
    debitedTxn : "everyone" | "following" | "none";
    flickstarTxn : "everyone" | "following" | "none";
    support : "everyone" | "following" | "none";
    trending : "everyone" | "following" | "none";
    feedback : "everyone" | "following" | "none";
    achievement : "everyone" | "following" | "none";
    newFeatures : "everyone" | "following" | "none";
    followingActivity : "everyone" | "following" | "none";
    engagement : "everyone" | "following" | "none";
    socialCause : "everyone" | "following" | "none";
    birthDay : "everyone" | "following" | "none";
    shareBirthday : "everyone" | "following" | "none";
    loginAlert : "everyone" | "following" | "none";
};

const UserNotificationSetting = new Schema<IShareSchema>(
    {
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        pauseAll : {
            type: Boolean,
            default: false,
        },
        likes : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        comments : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        tagged : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        addToPost : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        storyReaction : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        storyComment : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        storyTagged : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        message : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        messageRequest : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        messageRequestGroup : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        newFollower : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        newFollowing : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        acceptedFollower : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        suggestedFollower : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        profileMention : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        audioCall : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        videoCall : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        liveVideoStart : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        liveVideoEnd : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        recentlyUploaded : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        repost : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        audio : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        mostWatched : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        createdAQuest : {
            type: [String],
            enum: ["all", "everyone", "following", "goflick", "onflick", "none"],
            default: ["all"],
        },
        sponsoredQuest : {
            type: [String],
            enum: ["all", "goflick", "onflick", "none"],
            default: ["all"],
        },
        appliedForQuest : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        likedQuest : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        questUpdates : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        creditedTxn : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        debitedTxn : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        flickstarTxn : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        support : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        trending : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        feedback : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        achievement : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        newFeatures : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        followingActivity : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        engagement : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        socialCause : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        birthDay : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        shareBirthday : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
        loginAlert : {
            type: String,
            enum: ["everyone", "following", "none"],
            default: "everyone",
        },
    },
    { timestamps: { createdAt: false, updatedAt: true }, versionKey: false }
);

export const NOTIFICATIONSETTING = model<IShareSchema>('notificationsetting', UserNotificationSetting);
