import express, { Router } from "express";
import { toggleLike } from "../../controllers/Likes/toggleLike";

export const likeRoutes: Router = express.Router();

/**
 * @swagger
 * /like:
 *   post:
 *     summary: Toggle like
 *     tags: 
 *       - Like
 *     description: Toggles the like status for a user on a specific item.
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flick:
 *                 type: string
 *                 pattern: "^[0-9a-fA-F]{24}$"
 *                 example: "60b8d295f1b2c72f9c8b4567"
 *                 description: The unique ID of the flick
 *               comment:
 *                type: string
 *                pattern: "^[0-9a-fA-F]{24}$"
 *                example: "60b8d295f1b2c72f9c8b4567"
 *                description: The unique ID of the comment
 *               value:
 *                 type: boolean
 *                 example: true
 *                 description: The value of the like status
 *     responses:
 *       200:
 *         description: Successfully toggled like status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                  type: string
 *                  example: 'Like status toggled successfully'
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
likeRoutes.post("/like", toggleLike)

