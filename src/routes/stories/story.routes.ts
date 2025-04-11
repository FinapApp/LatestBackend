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
 *                 example: "A beautiful sunset"
 *               song:
 *                 type: string
 *                 example: "63f1a2b3c4d5e6f7a8b9c0d1"
 *               mediaURL:
 *                 type: string
 *                 example: "https://example.com/media.jpg"
 *               thumbnailURL:
 *                 type: string
 *                 example: "https://example.com/thumbnail.jpg"
 *               songStart:
 *                 type: number
 *                 example: 10
 *               songEnd:
 *                 type: number
 *                 example: 20
 *               hashTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "63f1a2b3c4d5e6f7a8b9c0d2"
 *               newHashTag:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "63f1a2b3c4d5e6f7a8b9c0d3"
 *                     value:
 *                       type: string
 *                       example: "newTag"
 *               mention:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "63f1a2b3c4d5e6f7a8b9c0d3"
 *                     value:
 *                       type: string
 *                       example: "mentionedUser"
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




