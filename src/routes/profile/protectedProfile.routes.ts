import express, { Router } from "express";
import { getProfileDetail } from "../../controllers/Profile/getProfileDetails";




export const protectedProfileRoutes: Router = express.Router();


/**
 * @swagger
 * /v1/profile/me:
 *   get:
 *     summary: Get the authenticated user's profile details
 *     description: Retrieve the profile details of the currently authenticated user.
 *     tags: [Protected Profile]
 *     responses:
 *       200:
 *         description: Successfully retrieved authenticated user's profile details
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
protectedProfileRoutes.get("/profile/me", getProfileDetail);