import { create } from "domain";
import { Response } from "express";

export const handleResponse = (
  res: Response,
  statusCode: number,
  value: object | null,
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
    return res.status(statusCode).json({
      success: true,
      ...value,
    });
  }
};

export const errors = {
  unable_to_create_user: {
    message: "Unable to create user",
  },
  audio_reported: {
    message: "Unable to report Audio"
  },
  unable_to_create_signedURL: {
    message: "Unable to create signed URL",
  },
  user_not_found: {
    message: "User not found",
  },
  status_changed_flicked : {
    message: "Status changed flicked"
  },
  session_not_found: {
    message: "Session not found"
  },
  session_deleted: {
    message: "Unable to delete session"
  },
  cannot_rerunIt: {
    message: "Don't rerun the code"
  },
  create_audio: {
    message: "Unable to create audio",
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
  add_story_viewer: {
    message: "Unable to add story viewer",
  },
  get_story_view: {
    message: "Unable to get story",
  },
  update_feedback: {
    message: "Unable to update feedback",
  },
  delete_feedback: {
    message: "Unable to delete feedback",
  },
  no_flicks: {
    message: "No flicks found"
  },
  toggle_like: {
    message: "Unable to toggle like"
  },
  retry_signup: {
    message: "Please retry signup",
  },
  username_exist: {
    message: "Username already exists",
  },
  email_exist: {
    message: "Email already exists"
  },
  comment_not_found: {
    message: "Comment not found",
  },

  max_applicants: {
    message: "Max applicants reached",
  },
  song_not_found: {
    message: "Song not found",
  },
  create_songs: {
    message: "Unable to create songs"
  },
  retry_login: {
    message: "Please get yourself authenticated"
  },
  create_quest_applicants: {
    message: "Unable to create quest applicants"
  },
  quest_deleted: {
    message: "Unable to delete quest"
  },
  story_uploaded: {
    message: "Unable to upload story"
  },
  story_deleted: {
    message: "Unable to delete story"
  },
  quest_not_found: {
    message: "Quest not found"
  },
  unauthorized: {
    message: "You're unauthorized to perform this action"
  },
  create_flick: {
    message: "Unable to create flick"
  },
  delete_story: {
    message: "Unable to delete story"
  },
  notification: {
    message: 'Unable to get notifications'
  },
  flick_uploaded: {
    message: "Unable to upload flick",
  },
  flick_not_found: {
    message: "flick not found",
  },
  comment_delete: {
    message: "Unable to delete comment",
  },
  password_not_updated: {
    message: "Password not updated",
  },
  validation: {
    success: false,
  },
  email_not_found: {
    message: "Email not found",
  },
  invalid_credentials: {
    message: "Invalid Credentials",
  },
  catch_error: {
    message: "An error occurred",
  },
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
  otp_expired: {
    message: "OTP has expired"
  },
  otp_not_match: {
    message: "OTP does not match"
  },
  update_comment: {
    message: "Unable to update comment"
  },
  create_comment: {
    message: "Unable to create comment",
  },
  flick_updated: {
    message: "Unable to update flick"
  },
  flick_created: {
    message: "Unable to create flick"
  },
  flick_deleted: {
    message: "Unable to delete flick"
  },
  user_reported: {
    message: "Unable to report User"
  },
  story_reported: {
    message: "Unable to report Story"
  },
  audio_uploaded: {
    message: "Unable to upload audio"
  },
  comment_reported: {
    message: "Unable to report Comment"
  },
  flick_reported: {
    message: "Unable to report Flick"
  },
  share_post: {
    message: "Unable to share post"
  },
  create_feedback: {
    message: "Unable to create feedback"
  },
  self_follow: {
    message: "You can't follow yourself"
  },
  user_unfollowed: {
    message: "Unable to unfollow user"
  },
  user_followed: {
    message: "Unable to follow user"
  },
  create_quest: {
    message: "Unable to create quest"
  },
};


export const success = {
  account_created: {
    message: "Account created successfully",
  },
  status_changed_flicked : {
    message: "Status changed successfully"
  },
  session_deleted: {
    message: "Session deleted successfully",
  },
  add_story_viewer: {
    message: "Story viewer added successfully",
  },
  update_feedback: {
    message: "Feedback updated successfully",
  },
  delete_feedback: {
    message: "Feedback deleted successfully",
  },
  toggle_like: {
    message: "Like toggled successfully"
  },
  song_uploaded: {
    message: "Song uploaded successfully",
  },
  create_quest_applicants: {
    message: "Quest applicants created successfully"
  },
  quest_deleted: {
    message: "Quest deleted successfully"
  },
  story_uploaded: {
    message: "Story uploaded successfully"
  },
  story_deleted: {
    message: "Story deleted successfully"
  },
  quest_uploaded: {
    message: "Quest uploaded successfully"
  },
  quest_created: {
    message: "Quest created successfully"
  },
  create_quest: {
    message: "Quest created successfully"
  },
  delete_story: {
    message: "Story deleted successfully"
  },
  flick_uploaded: {
    message: "flick uploaded successfully",
  },
  flick_updated: {
    message: "flick updated successfully",
  },
  flick_created: {
    message: "flick created successfully",
  },
  flick_deleted: {
    message: "flick deleted successfully",
  },
  user_followed: {
    message: "User followed successfully",
  },
  user_unfollowed: {
    message: "User unfollowed successfully",
  },
  user_reported: {
    message: "User reported successfully",
  },
  story_reported: {
    message: "Story reported successfully",
  },
  audio_reported : {
    message: "Audio reported successfully",
  },
  comment_reported: {
    message: "Comment reported successfully",
  },
  flick_reported: {
    message: "Flick reported successfully",
  },
  create_feedback: {
    message: "Feedback created successfully",
  },
  share_post: {
    message: "Post shared successfully",
  },
  comment_deleted: {
    message: "Comment deleted successfully",
  },
  create_comment: {
    message: "Comment created successfully",
  },
  update_comment: {
    message: "Comment updated successfully",
  },
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
};