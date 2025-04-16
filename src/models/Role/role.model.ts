import { Document, Schema, model } from "mongoose";
export enum Permission {
    // Admin permissions
    ViewAdmin = "viewAdmin",
    CreateAdmin = "createAdmin",
    UpdateAdmin = "updateAdmin",
    DeleteAdmin = "deleteAdmin",

    // Role permissions
    ViewRole = "viewRole",
    CreateRole = "createRole",
    UpdateRole = "updateRole",
    DeleteRole = "deleteRole",

    // User permissions
    ViewUser = "viewUser",
    UpdateUser = "updateUser",
    DeleteUser = "deleteUser",
    CreateUser = "createUser",

    // Flicks permissions
    ViewFlicks = "viewFlicks",
    UpdateFlicks = "updateFlicks",
    DeleteFlicks = "deleteFlicks",
    CreateFlicks = "createFlicks",

    // Songs permissions
    ViewSongs = "viewSongs",
    UpdateSongs = "updateSongs",
    DeleteSongs = "deleteSongs",
    CreateSongs = "createSongs",

    // Audio permissions
    ViewAudio = "viewAudio",
    UpdateAudio = "updateAudio",
    DeleteAudio = "deleteAudio",
    CreateAudio = "createAudio",

    // Quest permissions
    ViewQuest = "viewQuest",
    UpdateQuest = "updateQuest",
    DeleteQuest = "deleteQuest",
    CreateQuest = "createQuest",

    // Comment permissions
    ViewComment = "viewComment",
    UpdateComment = "updateComment",
    DeleteComment = "deleteComment",
    CreateComment = "createComment",

    // Feedbacks permissions
    ViewFeedbacks = "viewFeedbacks",
    UpdateFeedbacks = "updateFeedbacks",
    DeleteFeedbacks = "deleteFeedbacks",

    // Reports Flicks permissions
    ViewReportFlicks = "viewReportFlick",
    UpdateReportFlicks = "updateReportFlick",
    DeleteReportFlicks = "deleteReportFlick",


    // Reports Songs permissions
    ViewReportSongs = "viewReportSongs",
    UpdateReportSongs = "updateReportSongs",
    DeleteReportSongs = "deleteReportSongs",

    // Reports Audio permissions
    ViewReportAudio = "viewReportAudio",
    UpdateReportAudio = "updateReportAudio",
    DeleteReportAudio = "deleteReportAudio",


    // Reports Quest permissions
    ViewReportQuest = "viewReportQuest",
    UpdateReportQuest = "updateReportQuest",
    DeleteReportQuest = "deleteReportQuest",

    // Reports Comment permissions
    ViewReportComment = "viewReportComment",
    UpdateReportComment = "updateReportComment",
    DeleteReportComment = "deleteReportComment",

    // Reports Story permissions
    ViewReportStory = "viewReportStory",
    UpdateReportStory = "updateReportStory",
    DeleteReportStory = "deleteReportStory",

    // Story permissions
    ViewStory = "viewStory",
    UpdateStory = "updateStory",
    DeleteStory = "deleteStory",

    // Requests permissions
    ViewRequests = "viewRequests",
    UpdateRequests = "updateRequests",
    DeleteRequests = "deleteRequests",

    //Profile permissions
    UpdateProfile = "updateProfile",


    //Setting permissions
    UpdateSetting = "updateSetting",
    ViewSetting = "viewSetting",
    CreateSetting = "createSetting",
}


// Updated Role interface using Permission enum
export interface Role extends Document {
    staff: Schema.Types.ObjectId;
    status: boolean;
    name: string;
    permissions: Permission[]; // Store permissions as an array of Permission enum values
}

// Updated RoleSchema
export const RoleSchema = new Schema<Role>(
    {
        staff: { type: Schema.Types.ObjectId, ref: 'staff ' },
        name: { type: String, required: true },
        status: { type: Boolean, default: true },
        permissions: {
            type: [String],
            enum: Object.values(Permission),
            required: true
        }
    },
    { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

export const ROLES = model<Role>("role", RoleSchema);
