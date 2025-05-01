import express, { Router } from "express";
import { createSong } from "../../controllers/Songs/createSong";


export const songRoutes: Router = express.Router();





songRoutes.route("/song")
    .post(createSong)
