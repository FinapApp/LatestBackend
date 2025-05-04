import express, { Router } from "express";

import { followerHandler } from "../../controllers/Follow/FollowersToggler";
import { getFollowers } from "../../controllers/Follow/getFollowers";
import { getFollowing } from "../../controllers/Follow/getFollowing";

export const followRoutes: Router = express.Router();

followRoutes.post("/follow/:followerId", followerHandler);

followRoutes.get("/follower", getFollowers);

followRoutes.get("/following", getFollowing);
