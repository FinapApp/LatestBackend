import express, { Router } from "express";
import { deleteFlick } from "../../controllers/Flicks/deleteFlick";
import { createPresignedURLFlick } from "../../controllers/Flicks/createPresigedURLFlick";
import { createFlick } from "../../controllers/Flicks/createFlick";
import { getAllFlicks } from "../../controllers/Flicks/getFlicks";
import { getSelfFlicks } from "../../controllers/Flicks/getSelfFlicks";
import { getAllTaggedFlicks } from "../../controllers/Flicks/getAllTaggedFlicks";
import { updateFlick } from "../../controllers/Flicks/updateFlick";

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
     *     summary: Create a flick with detailed media and metadata
     *     tags:
     *       - Protected Flicks
     *     parameters:
     *       - in: path
     *         name: flickId
     *         required: true
     *         schema:
     *           type: string
     *           example: "60c72b2f9b1e8a5f4c8e7d1a"
     *         description: The ID of the flick
     *     requestBody:
     *       description: Object containing media and metadata for the flick
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
     *                       example: "photo"
     *                     alt:
     *                       type: string
     *                       example: "A scenic view"
     *                     url:
     *                       type: string
     *                       example: "https://example.com/media1.jpg"
     *                     taggedUsers:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           user:
     *                             type: string
     *                             example: "60c72b2f9b1e8a5f4c8e7d1b"
     *                           position:
     *                             type: object
     *                             properties:
     *                               x:
     *                                 type: number
     *                                 example: 0.5
     *                               y:
     *                                 type: number
     *                                 example: 0.5
     *                     duration:
     *                       type: number
     *                       example: 12.5
     *                     audio:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d1c"
     *               song:
     *                 type: string
     *                 example: "60c72b2f9b1e8a5f4c8e7d1d"
     *               songStart:
     *                 type: number
     *                 example: 10
     *               songEnd:
     *                 type: number
     *                 example: 25
     *               thumbnailURL:
     *                 type: string
     *                 example: "https://example.com/thumb.jpg"
     *               description:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     type:
     *                       type: string
     *                       example: "text"
     *                     mention:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d1e"
     *                     text:
     *                       type: string
     *                       example: "Enjoying the vibes!"
     *                     hashTag:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d1f"
     *               location:
     *                 type: string
     *                 example: "Los Angeles, CA"
     *               collabs:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d20"
     *                     position:
     *                       type: object
     *                       properties:
     *                         x:
     *                           type: number
     *                           example: 0.3
     *                         y:
     *                           type: number
     *                           example: 0.6
     *               newHashTags:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d21"
     *                     value:
     *                       type: string
     *                       example: "sunsetvibes"
     *               commentVisible:
     *                 type: boolean
     *                 example: true
     *               likeVisible:
     *                 type: boolean
     *                 example: false
     *     responses:
     *       200:
     *         description: Successfully created flick
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
     *                   example: Flick created successfully
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
     *   put:
     *     summary: Update a flick with optional fields
     *     tags:
     *       - Protected Flicks
     *     parameters:
     *       - in: path
     *         name: flickId
     *         required: true
     *         schema:
     *           type: string
     *           example: "60c72b2f9b1e8a5f4c8e7d1a"
     *         description: The ID of the flick
     *     requestBody:
     *       description: Object containing optional media and metadata for the flick
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
     *                       example: "photo"
     *                     alt:
     *                       type: string
     *                       example: "A scenic view"
     *                     url:
     *                       type: string
     *                       example: "https://example.com/media1.jpg"
     *                     taggedUsers:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           user:
     *                             type: string
     *                             example: "60c72b2f9b1e8a5f4c8e7d1b"
     *                           position:
     *                             type: object
     *                             properties:
     *                               x:
     *                                 type: number
     *                                 example: 0.5
     *                               y:
     *                                 type: number
     *                                 example: 0.5
     *                     duration:
     *                       type: number
     *                       example: 12.5
     *                     audio:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d1c"
     *               song:
     *                 type: string
     *                 example: "60c72b2f9b1e8a5f4c8e7d1d"
     *               songStart:
     *                 type: number
     *                 example: 10
     *               songEnd:
     *                 type: number
     *                 example: 25
     *               thumbnailURL:
     *                 type: string
     *                 example: "https://example.com/thumb.jpg"
     *               description:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     type:
     *                       type: string
     *                       example: "text"
     *                     mention:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d1e"
     *                     text:
     *                       type: string
     *                       example: "Enjoying the vibes!"
     *                     hashTag:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d1f"
     *               location:
     *                 type: string
     *                 example: "Los Angeles, CA"
     *               collabs:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d20"
     *                     position:
     *                       type: object
     *                       properties:
     *                         x:
     *                           type: number
     *                           example: 0.3
     *                         y:
     *                           type: number
     *                           example: 0.6
     *               newHashTags:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       example: "60c72b2f9b1e8a5f4c8e7d21"
     *                     value:
     *                       type: string
     *                       example: "sunsetvibes"
     *               commentVisible:
     *                 type: boolean
     *                 example: true
     *               likeVisible:
     *                 type: boolean
     *                 example: false
     *     responses:
     *       200:
     *         description: Successfully updated flick
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
     *                   example: Flick updated successfully
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
     *           example: "60c72b2f9b1e8a5f4c8e7d1a"
     *         description: The ID of the flick to delete
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
    .put(updateFlick)
    .delete(deleteFlick);

flickRoutes.get("/user-flicks", getSelfFlicks)

flickRoutes.get("/user-tagged-flicks",  getAllTaggedFlicks)