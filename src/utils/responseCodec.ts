import { Response } from "express";

export const handleResponse = (
  res: Response,
  statusCode: number,
  value: any,
  meta: Array<{
    message: string | null
  }> = []
) => {
  if (statusCode > 205) {
    return res.status(statusCode).json({
      success: false,
      message: meta?.[0]?.message ?? null, ...value
    });
  } else {
    if (value?.message) {
      return res.status(statusCode).json({
        success: true,
        message: value.message,
      });
    }
    return res.status(statusCode).json({
      success: true,
      data: { ...(value || {}) },
    });
  }
};
export const errors = {

  //Deactivate Account
  deactivate_account: {
    message: "Unable to deactivate account",
  },
// Song-related errors
  song_not_uploaded: {
    message: "Song not uploaded",
  },

  // Search-related errors
  search_history_not_found: {
    message: "Search history not found",
  },
  search_history_not_updated: {
    message: "Search history not updated",
  },
  search_history_not_deleted: {
    message: "Search history not deleted",
  },
  search_history_created: {
    message: "Search history created",
  },
  // Bio-links related errors
  bio_link_not_found: {
    message: "Bio-link not found",
  },
  bio_link_not_updated: {
    message: "Bio-link not updated",
  },
  bio_link_not_created: {
    message: "Bio-link not created",
  },
  bio_link_not_deleted: {
    message: "Bio-link not deleted",
  },

  //HashTags
  no_hashtags: {
    message: "No hashtags found",
  },
  create_hashtags: {
    message: "Unable to create hashtags",
  },
  // Two-factor authentication-related errors
  update_two_factor: {
    message: "Unable to update two-factor authentication",
  },
  get_two_factor: {
    message: "Unable to get two-factor authentication",
  },

  // Notification-related errors
  user_notification_not_found: {
    message: "Unable to get notifications",
  },
  update_notification_setting: {
    message: "Unable to update notification setting",
  },

  // Profile-related errors
  unable_to_signed_profile_image: {
    message: "Unable to signed profile image"
  },
  profile_not_updated: {
    message: "Unable to update profile",
  },
  profile_not_found: {
    message: "Profile not found",
  },

  // Password-related errors
  password_not_updated: {
    message: "Password not updated",
  },

  // User-related errors
  unable_to_create_user: {
    message: "Unable to create user",
  },
  user_not_found: {
    message: "User not found",
  },
  username_exist: {
    message: "Username already exists",
  },
  email_exist: {
    message: "Email already exists",
  },
  email_not_found: {
    message: "Email not found",
  },
  invalid_credentials: {
    message: "Invalid Credentials",
  },
  incorrect_password: {
    message: "Incorrect password , please try again",
  },
  unauthorized: {
    message: "You're unauthorized to perform this action",
  },
  user_reported: {
    message: "Unable to report User",
  },
  user_followed: {
    message: "Unable to follow user",
  },
  user_unfollowed: {
    message: "Unable to unfollow user",
  },
  follow_not_found: {
    message: "User not followed",
  },
  self_follow: {
    message: "You can't follow yourself",
  },
  follower_removed: {
    message: "Follower removed",
  },

  // Session-related errors
  session_not_found: {
    message: "Session not found",
  },
  session_deleted: {
    message: "Unable to delete session",
  },

  // Flick-related errors
  flick_not_found: {
    message: "flick not found",
  },
  flick_uploaded: {
    message: "Unable to upload flick",
  },
  flick_created: {
    message: "Unable to create flick",
  },
  flick_updated: {
    message: "Unable to update flick",
  },
  flick_deleted: {
    message: "Unable to delete flick",
  },
  flick_reported: {
    message: "Unable to report Flick",
  },
  no_flicks: {
    message: "No flicks found",
  },
  toggle_like: {
    message: "Unable to toggle like",
  },
  status_changed_flicked: {
    message: "Status changed flicked",
  },

  // Story-related errors
  story_already_exists: {
    message: "Story already exists",
  },
  story_uploaded: {
    message: "Unable to upload story",
  },
  story_deleted: {
    message: "Unable to delete story",
  },
  story_reported: {
    message: "Unable to report Story",
  },
  add_story_viewer: {
    message: "Unable to add story viewer",
  },
  get_story_view: {
    message: "Unable to get story",
  },

  // Comment-related errors
  comment_not_found: {
    message: "Comment not found",
  },
  comment_delete: {
    message: "Unable to delete comment",
  },
  comment_reported: {
    message: "Unable to report Comment",
  },
  create_comment: {
    message: "Unable to create comment",
  },
  update_comment: {
    message: "Unable to update comment",
  },

  // Feedback-related errors
  update_feedback: {
    message: "Unable to update feedback",
  },
  get_feedback: {
    message: "Unable to get feedback",
  },
  delete_feedback: {
    message: "Unable to delete feedback",
  },
  create_feedback: {
    message: "Unable to create feedback",
  },

  // Theme-related errors 
  update_theme: {
    message: "Unable to update theme",
  },
  get_theme: {
    message: "Unable to get theme",
  },

  // Quest-related errors
  cannot_apply_to_own_quest: {
    message: "You cannot apply to your own quest",
  },
  quest_already_applied: {
    message: "Already applied for this quest",
  },
  unable_to_delete_quest_after_approval: {
    message: "Unable to delete quest after approval",
  },
  unable_to_update_quest_after_approval: {
    message: "Unable to update quest after approval",
  },
  quest_already_exists: {
    message: "Quest already exists",
  },
  update_quest_applicants: {
    message: "Unable to update quest applicants",
  },
  update_quest: {
    message: "Unable to update quest",
  },
  quest_not_found: {
    message: "Quest not found",
  },
  quest_not_approved: {
    message: "Quest not approved",
  },
  create_quest: {
    message: "Unable to create quest",
  },
  quest_deleted: {
    message: "Unable to delete quest",
  },
  create_quest_applicants: {
    message: "Unable to create quest applicants",
  },
  quest_applicant_not_found: {
    message: "Quest applicant not found",
  },
  quest_applicant_not_updated: {
    message: "Quest applicant not updated",
  },
  quest_applicant_approval: {
    message: "Unable to approve quest applicant",
  },



  // Authentication-related errors
  no_token: {
    message: "No token provided",
  },
  jwt_expired: {
    message: "JWT has expired",
  },
  invalid_jwt: {
    message: "Invalid JWT",
  },
  jwt_verification_error: {
    message: "JWT verification error",
  },
  invalid_refresh_token: {
    message: "Invalid refresh token",
  },
  refresh_token_expired: {
    message: "Refresh token has expired",
  },
  refresh_token_not_found: {
    message: "Refresh token not found",
  },
  identifier_not_found: {
    message: "Identifier not found",
  },
  
  // OTP-related errors
  otp_expired: {
    message: "OTP has expired",
  },
  otp_not_match: {
    message: "OTP does not match",
  },

  // Miscellaneous errors
  retry_signup: {
    message: "Please retry signup",
  },
  retry_login: {
    message: "Please get yourself authenticated",
  },
  forget_password: {
    message: "Unable to send OTP",
  },
  audio_reported: {
    message: "Unable to report Audio",
  },
  audio_uploaded: {
    message: "Unable to upload audio",
  },
  create_audio: {
    message: "Unable to create audio",
  },
  create_songs: {
    message: "Unable to create songs",
  },
  song_not_found: {
    message: "Song not found",
  },
  max_applicants: {
    message: "Max applicants reached",
  },
  notification: {
    message: "Unable to get notifications",
  },
  share_post: {
    message: "Unable to share post",
  },
  validation: {
    success: false,
  },
  catch_error: {
    message: "An error occurred",
  },
  unable_to_create_signedURL: {
    message: "Unable to create signed URL",
  },
  cannot_rerunIt: {
    message: "Don't rerun the code",
  },
};

export const success = {
  // Delete Account
  delete_account: {
    message: "Account deleted successfully",
  },
  //Deactivate Account
  deactivate_account: {
    message: "Account deactivated successfully",
  },
  // Search-related success
  search_history_created: {
    message: "Search history created successfully",
  },
  search_history_deleted: {
    message: "Search history deleted successfully",
  },
  search_history_updated: {
    message: "Search history updated successfully",
  },
  // Bio-links related-success
  update_biolink: {
    message: "Bio-link updated successfully",
  },
  create_biolink: {
    message: "Bio-link created successfully",
  },
  delete_biolink: {
    message: "Bio-link deleted successfully",
  },

  // Two-factor authentication-related success
  update_two_factor: {
    message: "Two-factor authentication updated successfully",
  },
  // Notification-related success
  update_notification_setting: {
    message: "Notification setting updated successfully",
  },

  // Profile-related success
  profile_updated: {
    message: "Profile updated successfully",
  },

  // Password-related success
  password_updated: {
    message: "Password updated successfully",
  },

  // User-related success
  account_created: {
    message: "Account created successfully",
  },
  user_followed: {
    message: "User followed successfully",
  },
  user_unfollowed: {
    message: "User unfollowed successfully",
  },
  follower_removed: {
    message: "Follower removed successfully",
  },
  user_reported: {
    message: "User reported successfully",
  },

  // Session-related success
  session_deleted: {
    message: "Session deleted successfully",
  },

  // Flick-related success
  flick_uploaded: {
    message: "flick uploaded successfully",
  },
  flick_created: {
    message: "flick created successfully",
  },
  flick_updated: {
    message: "flick updated successfully",
  },
  flick_deleted: {
    message: "flick deleted successfully",
  },
  flick_reported: {
    message: "Flick reported successfully",
  },
  toggle_like: {
    message: "Like toggled successfully",
  },
  status_changed_flicked: {
    message: "Status changed successfully",
  },

  // Story-related success
  story_uploaded: {
    message: "Story uploaded successfully",
  },
  story_deleted: {
    message: "Story deleted successfully",
  },
  story_reported: {
    message: "Story reported successfully",
  },
  add_story_viewer: {
    message: "Story viewer added successfully",
  },

  // Comment-related success
  comment_deleted: {
    message: "Comment deleted successfully",
  },
  create_comment: {
    message: "Comment created successfully",
  },
  update_comment: {
    message: "Comment updated successfully",
  },
  comment_reported: {
    message: "Comment reported successfully",
  },

  // Feedback-related success
  update_feedback: {
    message: "Feedback updated successfully",
  },
  delete_feedback: {
    message: "Feedback deleted successfully",
  },
  create_feedback: {
    message: "Feedback created successfully",
  },
  //Theme Setting
  update_theme: {
    message: "Theme updated successfully",
  },
  // Quest-related success
  quest_created: {
    message: "Quest created successfully",
  },
  update_quest: {
    message: "Quest updated successfully",
  },
  quest_deleted: {
    message: "Quest deleted successfully",
  },
  create_quest_applicants: {
    message: "Quest applicants created successfully",
  },
  quest_applicant_updated: {
    message: "Quest applicant updated successfully",
  },

  // Authentication-related success
  login: {
    message: "Login successful",
  },
  logout: {
    message: "Logout successful",
  },
  verify_otp: {
    message: "OTP verified successfully",
  },
  otp_sent: {
    message: "OTP sent successfully",
  },
  username_available: {
    message: "Username is available",
  },
  email_available: {
    message: "Email is available",
  },

  // Miscellaneous success
  forget_password: {
    message: "OTP sent successfully",
  },
  share_post: {
    message: "Post shared successfully",
  },
  song_uploaded: {
    message: "Song uploaded successfully",
  },
  audio_reported: {
    message: "Audio reported successfully",
  },
};