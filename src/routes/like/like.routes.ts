import express, { Router } from "express";
import { toggleLike } from "../../controllers/Likes/toggleLike";
import { getAllLikes } from "../../controllers/Likes/getAllLikes";

export const likeRoutes: Router = express.Router();

/**
 * @swagger
 * /v1/like:
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
 *                 example: "67d2ce97854e076d22d7c9c8"
 *                 description: The unique ID of the flick
 *               comment:
 *                type: string
 *                pattern: "^[0-9a-fA-F]{24}$"
 *                example: "67d2ce97854e076d22d7c9c8"
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
/**
 * @swagger
 * /v1/like:
 *   get:
 *     summary: Get all likes
 *     tags: 
 *       - Like
 *     description: Retrieves all likes for a specific user or item.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         required: true
 *         description: The unique ID of the flick, comment, or quest
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [flick, comment, quest]
 *         required: true
 *         description: The type of the entity (flick, comment, or quest)
 *     responses:
 *       200:
 *         description: Successfully retrieved likes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "67d2ce97854e076d22d7c9c8"
 *                     description: The unique ID of the entity
 *                   type:
 *                     type: string
 *                     example: "flick"
 *                     description: The type of the entity
 *                   value:
 *                     type: boolean
 *                     example: true
 *                     description: The value of the like status
 *       400:
 *         description: Invalid query parameters
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
 *                   example: Invalid query parameters
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
likeRoutes.route("/like")
    .post(toggleLike)
    .get(getAllLikes)

