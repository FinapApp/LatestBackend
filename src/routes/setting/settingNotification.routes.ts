import express, { Router } from "express";
import { getUserNotificationSetting } from "../../controllers/Setting/Notification/getNotificationSetting";
import { updateNotificationSetting } from "../../controllers/Setting/Notification/updateNotificationSetting";


export const settingNotificationRoutes: Router = express.Router();





/**
 * @swagger
 * /v1/notification-setting:
 *   get:
 *     tags: 
 *       - Notification
 *     summary: Get user notification settings
 *     responses:
 *       200:
 *         description: Successfully retrieved notification settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     pauseAll:
 *                       type: boolean
 *                       example: false
 *                     likes:
 *                       type: string
 *                       example: "everyone"
 *                     comments:
 *                       type: string
 *                       example: "following"
 *                     tagged:
 *                       type: string
 *                       example: "none"
 *                     addToPost:
 *                       type: string
 *                       example: "everyone"
 *                     storyReaction:
 *                       type: string
 *                       example: "following"
 *                     storyComment:
 *                       type: string
 *                       example: "none"
 *                     storyTagged:
 *                       type: string
 *                       example: "everyone"
 *                     message:
 *                       type: string
 *                       example: "following"
 *                     messageRequest:
 *                       type: string
 *                       example: "none"
 *                     messageRequestGroup:
 *                       type: string
 *                       example: "everyone"
 *                     newFollower:
 *                       type: string
 *                       example: "following"
 *                     newFollowing:
 *                       type: string
 *                       example: "none"
 *                     acceptedFollower:
 *                       type: string
 *                       example: "everyone"
 *                     suggestedFollower:
 *                       type: string
 *                       example: "following"
 *                     profileMention:
 *                       type: string
 *                       example: "none"
 *                     audioCall:
 *                       type: string
 *                       example: "everyone"
 *                     videoCall:
 *                       type: string
 *                       example: "following"
 *                     liveVideoStart:
 *                       type: string
 *                       example: "none"
 *                     liveVideoEnd:
 *                       type: string
 *                       example: "everyone"
 *                     recentlyUploaded:
 *                       type: string
 *                       example: "following"
 *                     repost:
 *                       type: string
 *                       example: "none"
 *                     audio:
 *                       type: string
 *                       example: "everyone"
 *                     mostWatched:
 *                       type: string
 *                       example: "following"
 *                     createdAQuest:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["all", "everyone"]
 *                     sponsoredQuest:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["goflick", "onflick"]
 *                     appliedForQuest:
 *                       type: string
 *                       example: "none"
 *                     likedQuest:
 *                       type: string
 *                       example: "everyone"
 *                     questUpdates:
 *                       type: string
 *                       example: "following"
 *                     creditedTxn:
 *                       type: string
 *                       example: "none"
 *                     debitedTxn:
 *                       type: string
 *                       example: "everyone"
 *                     flickstarTxn:
 *                       type: string
 *                       example: "following"
 *                     support:
 *                       type: string
 *                       example: "none"
 *                     trending:
 *                       type: string
 *                       example: "everyone"
 *                     feedback:
 *                       type: string
 *                       example: "following"
 *                     achievement:
 *                       type: string
 *                       example: "none"
 *                     newFeatures:
 *                       type: string
 *                       example: "everyone"
 *                     followingActivity:
 *                       type: string
 *                       example: "following"
 *                     engagement:
 *                       type: string
 *                       example: "none"
 *                     socialCause:
 *                       type: string
 *                       example: "everyone"
 *                     birthDay:
 *                       type: string
 *                       example: "following"
 *                     shareBirthday:
 *                       type: string
 *                       example: "none"
 *                     loginAlert:
 *                       type: string
 *                       example: "everyone"
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred
 *   put:
 *     tags: 
 *       - Notification
 *     summary: Update user notification settings
 *     requestBody:
 *       description: Object containing notification settings to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pauseAll:
 *                 type: boolean
 *                 example: false
 *               likes:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               comments:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               tagged:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               addToPost:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               storyReaction:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               storyComment:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               storyTagged:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               message:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               messageRequest:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               messageRequestGroup:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               newFollower:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               newFollowing:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               acceptedFollower:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               suggestedFollower:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               profileMention:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               audioCall:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               videoCall:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               liveVideoStart:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               liveVideoEnd:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               recentlyUploaded:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               repost:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               audio:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               mostWatched:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               createdAQuest:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ["all", "everyone", "following", "goflick", "onflick", "none"]
 *                 example: ["all", "everyone"]
 *               sponsoredQuest:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ["all", "goflick", "onflick", "none"]
 *                 example: ["goflick", "onflick"]
 *               appliedForQuest:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               likedQuest:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               questUpdates:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               creditedTxn:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               debitedTxn:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               flickstarTxn:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               support:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               trending:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               feedback:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               achievement:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               newFeatures:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               followingActivity:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               engagement:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               socialCause:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *               birthDay:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "following"
 *               shareBirthday:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "none"
 *               loginAlert:
 *                 type: string
 *                 enum: ["everyone", "following", "none"]
 *                 example: "everyone"
 *     responses:
 *       200:
 *         description: Successfully updated notification settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification settings updated successfully
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred
 */

settingNotificationRoutes.route("/notification-setting")
    .get(getUserNotificationSetting)
    .put(updateNotificationSetting)

