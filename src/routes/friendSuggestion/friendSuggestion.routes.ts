
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     FRIENDSUGGESTIONS:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67d2ce97854e076d22d7c9c8"
 *                           username:
 *                             type: string
 *                             example: "johndoe"
 *                           name:
 *                             type: string
 *                             example: "John"
 *                           photo:
 *                             type: string
 *                             example: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/staff/67d96ac17d0486db4b315bbc/profile-image"
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
