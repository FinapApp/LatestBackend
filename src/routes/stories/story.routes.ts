import express, { Router } from "express";
import { createPresignedURLStory} from "../../controllers/Story/Story/createPresignedURLStory";
import { deleteStory } from "../../controllers/Story/Story/deleteStory";
import { getAllStory } from "../../controllers/Story/Story/getAllStory";
import { createStory } from "../../controllers/Story/Story/createStory";


export const storyRoutes: Router = express.Router();





/**
 * @swagger
 * /v1/story:
 *   post:
 *     tags: 
 *       - Stories
 *     summary: Create a presigned URL for a story
 *     requestBody:
 *       description: Object containing media details for the flick
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              fileType:
 *                type: string
 *                example: 'image/jpeg'
 *              fileName:
 *               type: string
 *               example: 'image.jpg'
 *     responses:
 *       200:
 *         description: Successfully created presigned URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 storyId:
 *                   type: string
 *                   example: 'flickId'
 *                 storySignedURL:
 *                   type: string
 *                   example: 'mediaURL1'
 *                 thumbnailSignedURL:
 *                   type: string
 *                   example: 'audioUploadURL'
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
 *   get:
 *     tags: 
 *       - Stories
 *     summary: Get all stories
 *     responses:
 *       200:
 *         description: A list of stories
 */

storyRoutes.route("/story")
    .post(createPresignedURLStory)
    .get(getAllStory)





/**
 * @swagger
 * /v1/story/{storyId}:
 *   post:
 *     tags: 
 *       - Stories
 *     summary: Create a story with media details
 *     requestBody:
 *       description: Object containing media details for the story
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mediaType
 *               - mediaURL
 *               - thumbnailURL
 *             properties:
 *               mediaType:
 *                 type: string
 *                 enum: ["photo", "video"]
 *                 example: "video"
 *               caption:
 *                 type: string
 *                 example: "My amazing story!"
 *               song:
 *                 type: string
 *                 description: "MongoDB ObjectId referencing a song"
 *                 pattern: "^[0-9a-fA-F]{24}$"
 *                 example: "60d21b4667d0d8992e610c85"
 *               mediaURL:
 *                 type: string
 *                 description: "URL to the media file"
 *                 example: "https://example.com/media/video.mp4"
 *               thumbnailURL:
 *                 type: string
 *                 description: "URL to the thumbnail image"
 *                 example: "https://example.com/media/thumbnail.jpg"
 *               songStart:
 *                 type: number
 *                 description: "Start time of the song in seconds"
 *                 example: 10
 *               songEnd:
 *                 type: number
 *                 description: "End time of the song in seconds"
 *                 example: 30
 *               hashTags:
 *                 type: array
 *                 description: "List of hashtags associated with the story"
 *                 items:
 *                   type: string
 *                 example: ["travel", "sunset"]
 *     responses:
 *       200:
 *         description: Successfully created the story
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 storyId:
 *                   type: string
 *                   example: "flickId"
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
 *                   example: "Invalid request parameters"
 *       500:
 *         description: Internal server error
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
 *                   example: "An unexpected error occurred"
 *   delete:
 *     tags:
 *       - Stories
 *     summary: Delete a quest
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quest Applicant deleted
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
 *                   example: "Story deleted successfully"
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
 *                   example: "Invalid request parameters"
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
 *                   example: "An error occurred"
 */

storyRoutes.route("/story/:storyId")
    .post(createStory)
    .delete(deleteStory)




