import express, { Router } from "express";
import { deleteFlick } from "../../controllers/Flicks/deleteFlick";
import { createPresignedURLFlick } from "../../controllers/Flicks/createPresigedURLFlick";
import { createFlick } from "../../controllers/Flicks/createFlick";
import { getAllFlicks } from "../../controllers/Flicks/getFlicks";
import { updateFlick } from "../../controllers/Flicks/updateFlick";

export const flickRoutes: Router = express.Router();

flickRoutes.route("/flick")
    .post(createPresignedURLFlick)
    .get(getAllFlicks);

flickRoutes.route("/flick/:flickId")
    .post(createFlick)
    .put(updateFlick)
    .delete(deleteFlick);
