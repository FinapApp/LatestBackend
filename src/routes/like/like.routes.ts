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
 *     responses:
 *       200:
 *         description: Successfully toggled like status.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
likeRoutes.post("/like", toggleLike)

