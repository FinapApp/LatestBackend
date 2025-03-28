import express, { Router } from "express";
import { createFeedback } from "../../controllers/Feedback/createFeedback";
import { deleteFeedback } from "../../controllers/Feedback/deleteFeedback";
import { updateFeedback } from "../../controllers/Feedback/updateFeedback";
import { getAllFeedbacks } from "../../controllers/Feedback/getFeedbacks";



// REDIRECTION TO THE APP STORE IF NOT THIS MAYBE
export const feedbackRoutes : Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback management
 */

/**
 * @swagger
 * /v1/feedback:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The feedback message
 *                 example: "Great app!"
 *               rating:
 *                 type: string
 *                 description: The feedback rating
 *                 example: "5"
 *     responses:
 *       200:
 *         description: Feedback created successfully
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
 *                   example: Feedback created successfully
 *       400:
 *         description: Unable to create feedback
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
 *                   example: Unable to create feedback
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
/**
 * @swagger
 * /v1/feedback:
 *   get:
 *     summary: Retrieve all feedbacks
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: A list of feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The feedback ID
 *                     example: "64b7c2f5e4b0d5a1c8e4f123"
 *                   admin:
 *                     type: string
 *                     description: The admin ID
 *                     example: "64b7c2f5e4b0d5a1c8e4f456"
 *                   user:
 *                     type: string
 *                     description: The user ID
 *                     example: "64b7c2f5e4b0d5a1c8e4f789"
 *                   message:
 *                     type: array
 *                     description: The feedback messages
 *                     items:
 *                       type: object
 *                       properties:
 *                         sentBy:
 *                           type: string
 *                           enum: [user, admin]
 *                           description: Who sent the message
 *                           example: "user"
 *                         message:
 *                           type: string
 *                           description: The message content
 *                           example: "Great app!"
 *                   rating:
 *                     type: number
 *                     description: The feedback rating
 *                     example: 5
 *                   status:
 *                     type: string
 *                     enum: [pending, resolved]
 *                     description: The feedback status
 *                     example: "pending"
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
feedbackRoutes.route("/feedback")
    .post(createFeedback)
    .get(getAllFeedbacks)

/**
 * @swagger
 * /v1/feedback/{feedbackId}:
 *   delete:
 *     summary: Delete a feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *         description: The feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
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
 *                   example: Feedback deleted successfully
 *       400:
 *         description: Unable to delete feedback
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
 *                   example: Unable to delete feedback
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
 *     summary: Update a feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *         description: The feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The updated feedback message
 *                 example: "Updated feedback message"
 *               rating:
 *                 type: number
 *                 description: The updated feedback rating
 *                 example: 4
 *               status:
 *                 type: string
 *                 enum: [pending, resolved]
 *                 description: The updated feedback status
 *                 example: "resolved"
 *     responses:
 *       200:
 *         description: Feedback updated successfully
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
 *                   example: Feedback updated successfully
 *       400:
 *         description: Unable to update feedback
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
 *                   example: Unable to update feedback
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

feedbackRoutes.route("/feedback/:feedbackId")
    .put(updateFeedback)
    .delete(deleteFeedback)