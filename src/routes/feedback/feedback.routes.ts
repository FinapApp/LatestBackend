import express, { Router } from "express";
import { createFeedback } from "../../controllers/Feedback/createFeedback";
import { deleteFeedback } from "../../controllers/Feedback/deleteFeedback";
import { updateFeedback } from "../../controllers/Feedback/updateFeedback";



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
 *     responses:
 *       200:
 *         description: Feedback created successfully
 */
feedbackRoutes.route("/feedback")
    .post(createFeedback)

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
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 */

feedbackRoutes.route("/feedback/:feedbackId")
    .put(updateFeedback)
    .delete(deleteFeedback)