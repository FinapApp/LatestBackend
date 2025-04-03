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
     *     summary: Create a new flick
     *     tags:
     *       - Protected Flicks
     *     parameters:
     *       - in: path
     *         name: flickId
     *         required: true
     *         schema:
     *           type: string
     *           pattern: "^[0-9a-fA-F]{24}$"
     *         description: The ID of the flick
     *     requestBody:
     *       description: Object containing details for the new flick
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
     *                     duration:
     *                       type: number
     *                     audio:
     *                       type: string
     *                       pattern: "^[0-9a-fA-F]{24}$"
     *                     alt:
     *                       type: string
     *                     taggedUsers:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           user:
     *                             type: string
     *                             pattern: "^[0-9a-fA-F]{24}$"
     *                           position:
     *                             type: object
     *                             properties:
     *                               x:
     *                                 type: number
     *                               y:
     *                                 type: number
     *                     url:
     *                       type: string
     *               song:
     *                 type: string
     *                 pattern: "^[0-9a-fA-F]{24}$"
     *               songStart:
     *                 type: number
     *               songEnd:
     *                 type: number
     *               thumbnailURL:
     *                 type: string
     *               description:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     type:
     *                       type: string
     *                       enum: ["user", "text"]
     *                     mention:
     *                       type: string
     *                       pattern: "^[0-9a-fA-F]{24}$"
     *                     text:
     *                       type: string
     *               location:
     *                 type: string
     *               collabs:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: string
     *                       pattern: "^[0-9a-fA-F]{24}$"
     *                     position:
     *                       type: object
     *                       properties:
     *                         x:
     *                           type: number
     *                         y:
     *                           type: number
     *               hashTags:
     *                 type: array
     *                 items:
     *                   type: string
     *               commentVisible:
     *                 type: boolean
     *               likeVisible:
     *                 type: boolean
     *     responses:
     *       201:
     *         description: Successfully created the flick
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
     *     summary: Update an existing flick
     *     tags:
     *       - Protected Flicks
     *     parameters:
     *       - in: path
     *         name: flickId
     *         required: true
     *         schema:
     *           type: string
     *           pattern: "^[0-9a-fA-F]{24}$"
     *         description: The ID of the flick
     *     requestBody:
     *       description: Object containing updated details for the flick
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
     *                     duration:
     *                       type: number
     *                     audio:
     *                       type: string
     *                       pattern: "^[0-9a-fA-F]{24}$"
     *                     alt:
     *                       type: string
     *                     taggedUsers:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           user:
     *                             type: string
     *                             pattern: "^[0-9a-fA-F]{24}$"
     *                           position:
     *                             type: object
     *                             properties:
     *                               x:
     *                                 type: number
     *                               y:
     *                                 type: number
     *                     url:
     *                       type: string
     *               song:
     *                 type: string
     *                 pattern: "^[0-9a-fA-F]{24}$"
     *               songStart:
     *                 type: number
     *               songEnd:
     *                 type: number
     *               thumbnailURL:
     *                 type: string
     *               description:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     type:
     *                       type: string
     *                       enum: ["user", "text"]
     *                     mention:
     *                       type: string
     *                       pattern: "^[0-9a-fA-F]{24}$"
     *                     text:
     *                       type: string
     *               location:
     *                 type: string
     *               collabs:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: string
     *                       pattern: "^[0-9a-fA-F]{24}$"
     *                     position:
     *                       type: object
     *                       properties:
     *                         x:
     *                           type: number
     *                         y:
     *                           type: number
     *               hashTags:
     *                 type: array
     *                 items:
     *                   type: string
     *               commentVisible:
     *                 type: boolean
     *               likeVisible:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Successfully updated the flick
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
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
     *           pattern: "^[0-9a-fA-F]{24}$"
     *         description: The ID of the flick
     *     responses:
     *       200:
     *         description: Successfully deleted the flick
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
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