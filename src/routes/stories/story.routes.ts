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
 *                   example: 'url1'
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
 *     summary: Create a story
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Object containing story details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaType:
 *                 type: string
 *                 enum: ["photo", "video"]
 *                 example: "photo"
 *               caption:
 *                 type: string
 *                 example: "Enjoying the beach vibes 🌊☀️"
 *               song:
 *                 type: string
 *                 example: "662b865ef9b7cf6e4e3a7ab9"
 *               url:
 *                 type: string
 *                 example: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/url"
 *               thumbnailURL:
 *                 type: string
 *                 example: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/thumbnail"
 *               songStart:
 *                 type: number
 *                 example: 10.5
 *               songEnd:
 *                 type: number
 *                 example: 20.0
 *               hashTags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hashtag:
 *                       type: string
 *                       example: "662b865ef9b7cf6e4e3a7ab1"
 *                     position:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: number
 *                           example: 0.25
 *                         y:
 *                           type: number
 *                           example: 0.60
 *                     size:
 *                       type: number
 *                       example: 1.1
 *                     text:
 *                       type: string
 *                       example: "#beachDay"
 *               newHashTags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "662b865ef9b7cf6e4e3a7ab4"
 *                     value:
 *                       type: string
 *                       example: "#relaxing"
 *               mention:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mention:
 *                       type: string
 *                       example: "662b865ef9b7cf6e4e3a7ab4"
 *                     position:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: number
 *                           example: 0.70
 *                         y:
 *                           type: number
 *                           example: 0.45
 *                     size:
 *                       type: number
 *                       example: 1.0
 *                     text:
 *                       type: string
 *                       example: "@john"
 *     responses:
 *       200:
 *         description: Story created successfully
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
 *                   example: "Story created successfully"
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
 *   delete:
 *     tags:
 *       - Stories
 *     summary: Delete a story
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story deleted successfully
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




