import express, { Router } from "express";
import { reportComment } from "../../controllers/Reports/reportComment";
import { reportFlick } from "../../controllers/Reports/reportFlick";
import { createPresignedURLReport } from "../../controllers/Reports/createPresignedURLReport";
import { reportStory } from "../../controllers/Reports/reportStory";
import { reportAudio } from "../../controllers/Reports/reportAudio";
import { reportUser } from "../../controllers/Reports/reportUser";

export const reportRoutes: Router = express.Router();

/**
 * @swagger
 * /v1/report/presigned-url:
 *   post:
 *     tags:
 *       - Reports
 *     summary: Create a presigned URL for a report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                     fileType:
 *                       type: string
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
 *                 reportId:
 *                   type: string
 *                   example: "questId"
 *                 attachmentSignedURLs:
 *                   type: array
 *                   items:
 *                     type: string
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
reportRoutes.post("/report/presigned-url", createPresignedURLReport);

/**
 * @swagger
 * /v1/report-comment/{commentId}:
 *   post:
 *     tags: 
 *       - Reports
 *     summary: Report a comment
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "attachment1"
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment reported successfully
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
 *                   example: "Comment reported successfully"
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
reportRoutes.post("/report-comment/:commentId", reportComment);

/**
 * @swagger
 * /v1/report-flick/{flickId}:
 *   post:
 *     tags: 
 *       - Reports
 *     summary: Report a flick
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "attachment1"
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flick reported successfully
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
 *                   example: "Flick reported successfully"
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
reportRoutes.post("/report-flick/:flickId", reportFlick);

/**
 * @swagger
 * /v1/report-user/{userId}:
 *   post:
 *     tags: 
 *       - Reports
 *     summary: Report a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "attachment1"
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: User reported successfully
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
 *                   example: "User reported successfully"
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
reportRoutes.post("/report-user/:userId", reportUser);

/**
 * @swagger
 * /v1/report-story/{storyId}:
 *   post:
 *     tags: 
 *       - Reports
 *     summary: Report a story
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "attachment1"
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Story reported successfully
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
 *                   example: "Story reported successfully"
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
reportRoutes.post("/report-story/:storyId", reportStory);

/**
 * @swagger
 * /v1/report-audio/{audioId}:
 *   post:
 *     tags: 
 *       - Reports
 *     summary: Report an audio
 *     parameters:
 *       - in: path
 *         name: audioId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "attachment1"
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Audio reported successfully
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
 *                   example: "Audio reported successfully"
 * 
 */
reportRoutes.post("/report-audio/:audioId", reportAudio);