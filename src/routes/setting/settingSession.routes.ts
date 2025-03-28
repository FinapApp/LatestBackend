
import express, { Router } from "express";
import { getSessions } from "../../controllers/Session/getSessions";
import { deleteSession } from "../../controllers/Session/deleteSession";
import { deleteSessions } from "../../controllers/Session/deleteSessions";


export const settingSessionRoutes: Router = express.Router();

/**
 * @swagger
 * /v1/session:
 *   get:
 *     summary: Get all sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Successfully retrieved all sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                    _id:
 *                     type: string
 *                     example: "60f7b3b4b3f3b30015f3f3b4"
 *                    device:
 *                      type: string
 *                      example: "iPhone"
 *                    ip:       
 *                      type: string
 *                      example : "192.1.1.0"
 *                    os:
 *                     type: string
 *                     example: "iOS"
 *                    createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00Z"
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
 *     summary: Delete all sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Successfully deleted all sessions
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
 *                   example: All sessions deleted successfully
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
 * /v1/session/{sessionId}:
 *   delete:
 *     summary: Delete a session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the session
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
 *                   example: Session deleted successfully
 *       404:
 *         description: Session not found
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
 *                   example: Session not found
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
settingSessionRoutes.route("/session")
    .get(getSessions)
    .delete(deleteSessions);

settingSessionRoutes.route("/session/:sessionId")
    .delete(deleteSession);