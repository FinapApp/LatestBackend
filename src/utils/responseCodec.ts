import { Response } from "express";

export const handleResponse = (
  res: Response,
  statusCode: number,
  value: any,
  meta: Array<{
    message: string | null
  }> = []
) => {
  if (res.headersSent) return;
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
  // Wallet-related errors
  wallet_not_found: {
    message: "Wallet could not be found. Please check your account details.",
  },
  insufficient_balance: {
    message: "Your wallet does not have sufficient balance to complete this transaction.",
  },
  // Referral Code
  referral_code_not_found: {
    message: "The referral code entered is invalid or does not exist.",
  },
  cannot_use_own_referral_code: {
    message: "You cannot use your own referral code. Please enter a different code.",
  },
  referral_code_already_used: {
    message: "This referral code has already been used.",
  },

  invalid_qr_string: {
    message: "The provided QR code is invalid. Please try again.",
  },

  // Permission-related errors
  permission_denied: {
    message: "You do not have permission to perform this action.",
  },

  // Feature-reported-issues
  create_feature_issue: {
    message: "We were unable to create your feature issue. Please try again later.",
  },
  user_deactivated: {
    message: "This user account has been deactivated.",
  },
  // Deactivate Account
  deactivate_account: {
    message: "We were unable to deactivate your account at this time.",
  },
  // Song-related errors
  song_not_uploaded: {
    message: "The song could not be uploaded. Please try again.",
  },

  // Search-related errors
  search_history_not_found: {
    message: "No search history found.",
  },
  search_history_not_updated: {
    message: "Unable to update search history. Please try again.",
  },
  search_history_not_deleted: {
    message: "Unable to delete search history. Please try again.",
  },
  search_history_created: {
    message: "Search history was created, but with issues. Please review.",
  },
  // Bio-links related errors
  bio_link_not_found: {
    message: "The requested bio-link could not be found.",
  },
  bio_link_not_updated: {
    message: "Unable to update the bio-link. Please try again.",
  },
  bio_link_not_created: {
    message: "Unable to create the bio-link. Please try again.",
  },
  bio_link_not_deleted: {
    message: "Unable to delete the bio-link. Please try again.",
  },

  // HashTags
  no_hashtags: {
    message: "No hashtags were found for your request.",
  },
  create_hashtags: {
    message: "Unable to create hashtags at this time.",
  },
  // Two-factor authentication-related errors
  update_two_factor: {
    message: "Unable to update two-factor authentication settings.",
  },
  get_two_factor: {
    message: "Unable to retrieve two-factor authentication settings.",
  },

  // Notification-related errors
  user_notification_not_found: {
    message: "Unable to retrieve notifications at this time.",
  },
  update_notification_setting: {
    message: "Unable to update notification settings. Please try again.",
  },

  // Profile-related errors
  profile_image_deleted: {
    message: "Profile image was deleted, but with issues. Please review.",
  },
  unable_to_signed_profile_image: {
    message: "Unable to generate a signed URL for your profile image.",
  },
  profile_not_updated: {
    message: "Unable to update your profile. Please try again.",
  },
  profile_not_found: {
    message: "Profile not found. Please check your account details.",
  },

  // Password-related errors
  password_not_updated: {
    message: "Unable to update your password. Please try again.",
  },

  // User-related errors
  unable_to_create_user: {
    message: "Unable to create user account. Please try again later.",
  },
  user_not_found: {
    message: "User not found. Please check your credentials.",
  },
  username_exist: {
    message: "This username is already taken. Please choose another.",
  },
  phone_exist: {
    message: "This phone number is already associated with another account.",
  },
  phone_not_found: {
    message: "Phone number not found. Please check and try again.",
  },
  email_exist: {
    message: "This email address is already registered.",
  },
  email_not_found: {
    message: "Email address not found. Please check and try again.",
  },
  invalid_credentials: {
    message: "The credentials provided are invalid. Please try again.",
  },
  incorrect_password: {
    message: "Incorrect password. Please try again.",
  },
  unauthorized: {
    message: "You are not authorized to perform this action.",
  },
  user_reported: {
    message: "Unable to report this user at the moment.",
  },
  user_followed: {
    message: "Unable to follow this user. Please try again.",
  },
  toggle_follow: {
    message: "Unable to update follow status. Please try again.",
  },
  user_unfollowed: {
    message: "Unable to unfollow this user. Please try again.",
  },
  follow_not_found: {
    message: "You are not following this user.",
  },
  self_follow: {
    message: "You cannot follow yourself.",
  },
  follower_removed: {
    message: "Follower was removed, but with issues. Please review.",
  },

  // Session-related errors
  session_not_found: {
    message: "Session not found. Please log in again.",
  },
  session_deleted: {
    message: "Unable to delete session. Please try again.",
  },

  // Flick-related errors
  flick_not_found: {
    message: "The requested flick could not be found.",
  },
  flick_uploaded: {
    message: "Unable to upload flick. Please try again.",
  },
  flick_created: {
    message: "Unable to create flick. Please try again.",
  },
  flick_updated: {
    message: "Unable to update flick. Please try again.",
  },
  flick_deleted: {
    message: "Unable to delete flick. Please try again.",
  },
  flick_reported: {
    message: "Unable to report this flick at the moment.",
  },
  no_flicks: {
    message: "No flicks found for your request.",
  },
  toggle_like: {
    message: "Unable to update like status. Please try again.",
  },
  status_changed_flicked: {
    message: "Unable to change flick status. Please try again.",
  },

  // Story-related errors
  story_already_exists: {
    message: "A story already exists for this context.",
  },
  story_uploaded: {
    message: "Unable to upload story. Please try again.",
  },
  story_deleted: {
    message: "Unable to delete story. Please try again.",
  },
  story_reported: {
    message: "Unable to report this story at the moment.",
  },
  add_story_viewer: {
    message: "Unable to add viewer to story. Please try again.",
  },
  get_story_view: {
    message: "Unable to retrieve story view. Please try again.",
  },

  // Comment-related errors
  comment_not_authorized: {
    message: "You are not authorized to perform this comment action.",
  },
  comment_not_found: {
    message: "Comment not found.",
  },
  comment_delete: {
    message: "Unable to delete comment. Please try again.",
  },
  comment_reported: {
    message: "Unable to report this comment at the moment.",
  },
  create_comment: {
    message: "Unable to create comment. Please try again.",
  },
  update_comment: {
    message: "Unable to update comment. Please try again.",
  },

  // Feedback-related errors
  update_feedback: {
    message: "Unable to update feedback. Please try again.",
  },
  get_feedback: {
    message: "Unable to retrieve feedback. Please try again.",
  },
  delete_feedback: {
    message: "Unable to delete feedback. Please try again.",
  },
  create_feedback: {
    message: "Unable to create feedback. Please try again.",
  },

  // Theme-related errors 
  update_theme: {
    message: "Unable to update theme settings. Please try again.",
  },
  get_theme: {
    message: "Unable to retrieve theme settings. Please try again.",
  },

  // Quest-related errors
  quest_already_closed: {
    message: "This quest is already closed and cannot be modified.",
  },
  cannot_apply_to_own_quest: {
    message: "You cannot apply to your own quest.",
  },
  quest_already_applied: {
    message: "You have already applied for this quest.",
  },
  unable_to_delete_quest_after_approval: {
    message: "Unable to delete quest after it has been approved.",
  },
  unable_to_update_quest_after_approval: {
    message: "Unable to update quest after it has been approved.",
  },
  quest_already_exists: {
    message: "A quest with these details already exists.",
  },
  update_quest_applicants: {
    message: "Unable to update quest applicants. Please try again.",
  },
  update_quest: {
    message: "Unable to update quest. Please try again.",
  },
  quest_not_found: {
    message: "Quest not found. Please check the details and try again.",
  },
  quest_not_authorized: {
    message: "You are not authorized to access this quest.",
  },
  create_quest: {
    message: "Unable to create quest. Please try again.",
  },
  quest_deleted: {
    message: "Unable to delete quest. Please try again.",
  },
  create_quest_applicants: {
    message: "Unable to create quest applicants. Please try again.",
  },
  quest_applicant_not_found: {
    message: "Quest applicant not found.",
  },
  quest_applicant_not_updated: {
    message: "Unable to update quest applicant. Please try again.",
  },
  quest_applicant_approval: {
    message: "Unable to approve quest applicant. Please try again.",
  },

  // Authentication-related errors
  no_token: {
    message: "Authentication token is missing. Please log in.",
  },
  jwt_expired: {
    message: "Your session has expired. Please log in again.",
  },
  invalid_jwt: {
    message: "Invalid authentication token. Please log in again.",
  },
  jwt_verification_error: {
    message: "There was an error verifying your authentication token.",
  },
  invalid_refresh_token: {
    message: "Invalid refresh token. Please log in again.",
  },
  refresh_token_expired: {
    message: "Your session has expired. Please log in again.",
  },
  refresh_token_not_found: {
    message: "Refresh token not found. Please log in again.",
  },
  identifier_not_found: {
    message: "Identifier not found. Please check your details.",
  },

  // OTP-related errors
  otp_expired: {
    message: "The OTP has expired. Please request a new one.",
  },
  otp_not_match: {
    message: "The OTP entered is incorrect. Please try again.",
  },

  // Miscellaneous errors
  retry_signup: {
    message: "Signup failed. Please try again.",
  },
  retry_login: {
    message: "Authentication failed. Please log in again.",
  },
  forget_password: {
    message: "Unable to send OTP for password reset. Please try again.",
  },
  audio_reported: {
    message: "Unable to report this audio at the moment.",
  },
  audio_uploaded: {
    message: "Unable to upload audio. Please try again.",
  },
  create_audio: {
    message: "Unable to create audio. Please try again.",
  },
  create_songs: {
    message: "Unable to create songs. Please try again.",
  },
  song_not_found: {
    message: "Song not found.",
  },
  max_applicants: {
    message: "The maximum number of applicants has been reached for this quest.",
  },
  notification: {
    message: "Unable to retrieve notifications at this time.",
  },
  share_post: {
    message: "Unable to share post. Please try again.",
  },
  validation: {
    success: false,
    message: "Validation failed. Please check your input and try again.",
  },
  catch_error: {
    message: "An unexpected error occurred. Please try again later.",
  },
  unable_to_create_signedURL: {
    message: "Unable to generate a signed URL at this time.",
  },
  cannot_rerunIt: {
    message: "This operation cannot be repeated. Please contact support if you need assistance.",
  },
};

export const success = {
  // Referral Code
  referral_code_applied: {
    message: "Referral code applied successfully. Welcome to the community!",
  },
  // Two-Factor Authentication
  two_factor_code_sent: {
    message: "A verification code has been sent to your device for two-factor authentication.",
  },
  // Feature-reported-issues 
  create_feature_issue: {
    message: "Thank you for your feedback. Your feature request has been submitted successfully.",
  },
  // Delete Account
  delete_account: {
    message: "Your account has been deleted. We're sorry to see you go.",
  },
  // Deactivate Account
  deactivate_account: {
    message: "Your account has been deactivated. You can reactivate it anytime by logging in.",
  },
  // Search-related success
  search_history_created: {
    message: "Your search history has been saved successfully.",
  },
  search_history_deleted: {
    message: "Your search history has been deleted.",
  },
  search_history_updated: {
    message: "Your search history has been updated.",
  },
  // Bio-links related-success
  update_biolink: {
    message: "Your bio-link has been updated successfully.",
  },
  create_biolink: {
    message: "Your bio-link has been created successfully.",
  },
  delete_biolink: {
    message: "Your bio-link has been deleted.",
  },

  // Two-factor authentication-related success
  update_two_factor: {
    message: "Two-factor authentication settings updated successfully.",
  },
  // Notification-related success
  update_notification_setting: {
    message: "Your notification settings have been updated.",
  },

  // Profile-related success
  profile_image_deleted: {
    message: "Your profile image has been deleted.",
  },

  profile_updated: {
    message: "Your profile has been updated successfully.",
  },

  // Password-related success
  password_updated: {
    message: "Your password has been changed successfully.",
  },

  // User-related success
  account_created: {
    message: "Your account has been created. Welcome aboard!",
  },
  user_followed: {
    message: "You are now following this user.",
  },
  user_unfollowed: {
    message: "You have unfollowed this user.",
  },
  follower_removed: {
    message: "The follower has been removed from your list.",
  },
  user_reported: {
    message: "Thank you for reporting. We will review this user promptly.",
  },

  // Session-related success
  session_deleted: {
    message: "You have been logged out successfully.",
  },

  // Flick-related success
  flick_reposted: {
    message: "Flick reposted successfully. Share your favorite moments!",
  },
  flick_uploaded: {
    message: "Your flick has been uploaded successfully.",
  },
  flick_created: {
    message: "Your flick has been created successfully.",
  },
  flick_updated: {
    message: "Your flick has been updated.",
  },
  flick_deleted: {
    message: "Your flick has been deleted.",
  },
  flick_reported: {
    message: "Thank you for reporting. We will review this flick.",
  },
  toggle_like: {
    message: "Your like status has been updated.",
  },
  status_changed_flicked: {
    message: "Flick status changed successfully.",
  },

  // Story-related success
  story_uploaded: {
    message: "Your story has been uploaded successfully.",
  },
  story_deleted: {
    message: "Your story has been deleted.",
  },
  story_reported: {
    message: "Thank you for reporting. We will review this story.",
  },
  add_story_viewer: {
    message: "Viewer added to your story.",
  },

  // Comment-related success
  comment_deleted: {
    message: "Your comment has been deleted.",
  },
  create_comment: {
    message: "Your comment has been posted.",
  },
  update_comment: {
    message: "Your comment has been updated.",
  },
  comment_reported: {
    message: "Thank you for reporting. We will review this comment.",
  },

  // Feedback-related success
  update_feedback: {
    message: "Your feedback has been updated. Thank you for helping us improve.",
  },
  delete_feedback: {
    message: "Your feedback has been deleted.",
  },
  create_feedback: {
    message: "Thank you for your feedback. We appreciate your input.",
  },
  // Theme Setting
  update_theme: {
    message: "Your theme settings have been updated.",
  },
  // Quest-related success
  qr_verified_success: {
    message: "QR code verified successfully. You may proceed.",
  },
  quest_status_closed: {
    message: "The quest has been closed successfully.",
  },
  quest_created: {
    message: "Your quest has been created successfully.",
  },
  update_quest: {
    message: "Your quest has been updated.",
  },
  quest_deleted: {
    message: "Your quest has been deleted.",
  },
  create_quest_applicants: {
    message: "Quest applicants have been added successfully.",
  },
  quest_applicant_updated: {
    message: "Quest applicant updated successfully.",
  },

  // Authentication-related success
  login: {
    message: "Login successful. Welcome back!",
  },
  logout: {
    message: "You have been logged out. See you again soon!",
  },
  verify_otp: {
    message: "OTP verified successfully. You may continue.",
  },
  otp_sent: {
    message: "A one-time password has been sent to your device.",
  },
  username_available: {
    message: "This username is available.",
  },
  email_available: {
    message: "This email address is available.",
  },
  phone_available: {
    message: "This phone number is available.",
  },

  // Miscellaneous success
  share_post: {
    message: "Your post has been shared successfully.",
  },
  song_uploaded: {
    message: "Your song has been uploaded successfully.",
  },
  audio_reported: {
    message: "Thank you for reporting. We will review this audio.",
  },
};