import express, { Router } from "express";
import { toggleLike } from "../../controllers/Likes/toggleLike";
import { getAllLikes } from "../../controllers/Likes/getAllLikes";

export const likeRoutes: Router = express.Router();

likeRoutes.route("/like")
    .post(toggleLike)
    .get(getAllLikes)

