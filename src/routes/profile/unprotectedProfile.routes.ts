
import express, { Router } from "express";
import { getProfileDetailById } from "../../controllers/Profile/getProfileDetailsById";



export const unprotectedProfileRoutes: Router = express.Router();


/**
 * @swagger
 * /profile/{userId}:
 *   tags: [Unprotected Profile]
 *   get:
 *     summary: Get unprotected profile details of a user
 *     description: Retrieve the unprotected profile details of a user by their userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved unprotected user profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileDetail:
 *                   type: object
 *                   properties:
 *                     flickCount:
 *                       type: number
 *                     followingCount:
 *                       type: number
 *                     followerCount:
 *                       type: number
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: array
 *                       items:
 *                         type: string
 *                 bioLinks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       url:
 *                         type: string
 *                       title:
 *                         type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
unprotectedProfileRoutes.get("/profile/:userId", getProfileDetailById  )