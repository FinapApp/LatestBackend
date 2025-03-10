import express, { Router } from "express";
import { reportComment } from "../../controllers/Reports/reportComment";
import { reportFlick } from "../../controllers/Reports/reportFlick";

export const reportRoutes: Router = express.Router();




/**
 * @swagger
 * /report-comment/{commentId}:
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
 *     responses:
 *       200:
 *         description: Comment reported successfully
 */

reportRoutes.post("/report-comment/:commentId", reportComment);


/**
 * @swagger
 * /report-flick/{flickId}:
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
 *     responses:
 *       200:
 *         description: Flick reported successfully
 */


reportRoutes.post("/report-flick/:flickId", reportFlick);


/**
 * @swagger
 * /report-user/{userId}:
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
 *     responses:
 *       200:
 *         description: User reported successfully
 */


reportRoutes.post("/report-user/:userId", reportFlick);
