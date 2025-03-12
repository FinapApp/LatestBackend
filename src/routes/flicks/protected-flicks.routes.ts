import express, { Router } from "express";
import { deleteFlick } from "../../controllers/Flicks/deleteFlick";
import { createPresignedURLFlick } from "../../controllers/Flicks/createPresigedURLFlick";
import { createFlick } from "../../controllers/Flicks/createFlick";
import { getAllFlicks } from "../../controllers/Flicks/getFlicks";

export const flickRoutes: Router = express.Router();

/**
 * @swagger
 * /v1/flick:
 *   post:
 *     summary: Create a presigned URL for uploading a flick
 *     tags:
 *       - Protected Flicks
 *     requestBody:
 *       description: Object containing media details for the flick
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               audioName:
 *                 type: string
 *                 example: 'audio.mp3'
 *               mediaFiles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                       example: 'video.mp4'
 *                     fileType:
 *                       type: string
 *                       example: 'video/mp4'
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
 *                 flickId:
 *                   type: string
 *                   example: 'flickId'
 *                 mediaUploadURLs:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: 'mediaURL1'
 *                 audioUploadURL:
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
 *     summary: Get all flicks
 *     tags:
 *       - Protected Flicks
 *     responses:
 *       200:
 *         description: Successfully retrieved all flicks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 flicks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 'flickId'
 *                       title:
 *                         type: string
 *                         example: 'Flick Title'
 *                       description:
 *                         type: string
 *                         example: 'Flick Description'
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
flickRoutes.route("/flick")
    .post(createPresignedURLFlick)
    .get(getAllFlicks);

/**
 * @swagger
 * /v1/flick/{flickId}:
 *   post:
 *     summary: Create a flick
 *     tags:
 *       - Protected Flicks
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flick
 *     requestBody:
 *       description: Object containing details for the flick
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["photo", "video"]
 *                       example: "photo"
 *                     duration:
 *                       type: number
 *                       example: 15
 *                     alt:
 *                       type: string
 *                       example: "A beautiful sunset over the ocean"
 *                     url:
 *                       type: string
 *                       example: "https://example.com/media/photo1.jpg"
 *                     song:
 *                       type: string
 *                       example: "65a3d9f8b8e2c4f9a3d4e1f2"
 *                     songStart:
 *                       type: number
 *                       example: 10
 *                     songEnd:
 *                       type: number
 *                       example: 25
 *                     songPosition:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: number
 *                           example: 50
 *                         y:
 *                           type: number
 *                           example: 80
 *                     taggedUsers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                             example: "65a3e0f9c3d2b5f9a1e4c2d3"
 *                           position:
 *                             type: object
 *                             properties:
 *                               x:
 *                                 type: number
 *                                 example: 30
 *                               y:
 *                                 type: number
 *                                 example: 60
 *               thumbnailURL:
 *                 type: string
 *                 example: "https://example.com/media/thumbnail.jpg"
 *               description:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["user", "text"]
 *                       example: "text"
 *                     mention:
 *                       type: string
 *                       example: "65c3e1d9b8f2a4c6d1e5b2f3"
 *                     text:
 *                       type: string
 *                       example: "Nature never goes out of style. 🌿🌄"
 *               location:
 *                 type: string
 *                 example: "Grand Canyon, Arizona"
 *               collabs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       example: "65d4f3b2a1e6c5d9b8f2e3c4"
 *                     position:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: number
 *                           example: 40
 *                         y:
 *                           type: number
 *                           example: 70
 *               hashTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["#travel", "#sunset", "#adventure"]
 *               commentVisible:
 *                 type: boolean
 *                 example: true
 *               likeVisible:
 *                 type: boolean
 *                 example: true
 *     responses:
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
 *   delete:
 *     summary: Delete a flick
 *     tags:
 *       - Protected Flicks
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flick
 *     responses:
 *       200:
 *         description: Successfully deleted flick
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
 *                   example: Flick deleted successfully
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
flickRoutes.route("/flick/:flickId")
    .post(createFlick)
    .delete(deleteFlick);
