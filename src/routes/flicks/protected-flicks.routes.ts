import express, { Router } from "express";
import { deleteFlick } from "../../controllers/Flicks/deleteFlick";
import { createPresignedURLFlick } from "../../controllers/Flicks/createPresigedURLFlick";
import { createFlick } from "../../controllers/Flicks/createFlick";
import { getAllFlicks } from "../../controllers/Flicks/getAllFlicks";
import { updateFlick } from "../../controllers/Flicks/updateFlick";
import { repostFlick } from "../../controllers/Flicks/repostFlick";
import { getFlick } from "../../controllers/Flicks/getFlick";
import { getMentionByFlick } from "../../controllers/Flicks/getMentionByFlick";

export const flickRoutes: Router = express.Router();

flickRoutes.route("/flick")
    .post(createPresignedURLFlick)
    .get(getAllFlicks);

flickRoutes.route("/flick/:flickId")
    .get(getFlick)
    .post(createFlick)
    .put(updateFlick)
    .delete(deleteFlick);

flickRoutes.get("/mention-flick/:flickId", getMentionByFlick)

flickRoutes.route("/repost-flick/:flickId")
    .post(repostFlick)

