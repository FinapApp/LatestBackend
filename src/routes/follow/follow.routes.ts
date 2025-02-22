import express, { Router } from "express";

import { followerToggle } from "../../controllers/Follow/FollowersToggler";
import { getFollowers } from "../../controllers/Follow/getFollowers";
import { getFollowing } from "../../controllers/Follow/getFollowing";

export const followRoutes: Router = express.Router();

followRoutes.post("/follow/:followerId", followerToggle)


followRoutes.get("/follower" , getFollowers)
followRoutes.get("/following" , getFollowing)



