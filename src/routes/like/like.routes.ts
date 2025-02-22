import express, { Router } from "express";
import { toggleLike } from "../../controllers/Likes/toggleLike";

export const likeRoutes: Router = express.Router();

likeRoutes.post("/like", toggleLike)


