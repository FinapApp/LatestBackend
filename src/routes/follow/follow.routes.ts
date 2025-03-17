import express, { Router } from "express";

import { followerToggle } from "../../controllers/Follow/FollowersToggler";
import { getFollowers } from "../../controllers/Follow/getFollowers";
import { getFollowing } from "../../controllers/Follow/getFollowing";

export const followRoutes: Router = express.Router();

/**
 * @swagger
 * /v1/follow/{followerId}:
 *   post:
 *     summary: Toggle follower
 *     tags:
 *       - Follow
 *     parameters:
 *       - in: path
 *         name: followerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the follower
 *     responses:
 *       200:
 *         description: Successfully toggled follower
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
 *                   example: "User followed"  # or "User unfollowed"
 *       400:
 *         description: Invalid follower ID
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
 *                   example: "You cannot follow yourself"
 *       404:
 *         description: User not found
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
 *                   example: "User not found"
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
 *                   example: "An error occurred"
 */
followRoutes.post("/follow/:followerId", followerToggle);

/**
 * @swagger
 * /v1/follower:
 *   get:
 *     summary: Get followers
 *     tags:
 *       - Follow
 *     responses:
 *       200:
 *         description: Successfully retrieved followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "followerId"
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *       400:
 *         description: Error retrieving followers
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
 *                   example: "Error retrieving followers"
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
 *                   example: "An error occurred"
 */
followRoutes.get("/follower", getFollowers);

/**
 * @swagger
 * /v1/following:
 *   get:
 *     summary: Get following
 *     tags:
 *       - Follow
 *     responses:
 *       200:
 *         description: Successfully retrieved following
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 following:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "followingId"
 *                       username:
 *                         type: string
 *                         example: "jane_doe"
 *       400:
 *         description: Error retrieving following
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
 *                   example: "Error retrieving following"
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
 *                   example: "An error occurred"
 */
followRoutes.get("/following", getFollowing);
