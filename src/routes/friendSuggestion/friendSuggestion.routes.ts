
import express, { Router } from "express";
import { getFriendSuggestion } from "../../controllers/FriendsSuggestion/getFriendSuggestion";


export const friendSuggestionRoutes: Router = express.Router();


/**
 * @swagger
 * /v1/friend-suggestion:
 *   get:
 *     summary: Get Friend Suggestions
 *     tags: [Friend Suggestions]
 *     responses:
 *       200:
 *         description: Successfully retrieved friend suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60f7b3b4b3f3b30015f3f3b4"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   username:
 *                     type: string
 *                     example: "johndoe"
 *                   photo:
 *                     type: string
 *                     example: "https://via.placeholder.com/150"
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

friendSuggestionRoutes.route("/friend-suggestion")
    .get(getFriendSuggestion);
