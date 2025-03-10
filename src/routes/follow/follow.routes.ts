import express, { Router } from "express";

import { followerToggle } from "../../controllers/Follow/FollowersToggler";
import { getFollowers } from "../../controllers/Follow/getFollowers";
import { getFollowing } from "../../controllers/Follow/getFollowing";

export const followRoutes: Router = express.Router();

/**
 * @swagger
 * /follow/{followerId}:
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
 *       400:
 *         description: Invalid follower ID
 */
followRoutes.post("/follow/:followerId", followerToggle);

/**
 * @swagger
 * /follower:
 *   get:
 *     summary: Get followers
 *     tags:
 *       - Follow
 *     responses:
 *       200:
 *         description: Successfully retrieved followers
 *       400:
 *         description: Error retrieving followers
 */
followRoutes.get("/follower", getFollowers);

/**
 * @swagger
 * /following:
 *   get:
 *     summary: Get following
 *     tags:
 *       - Follow
 *     responses:
 *       200:
 *         description: Successfully retrieved following
 *       400:
 *         description: Error retrieving following
 */
followRoutes.get("/following", getFollowing);
