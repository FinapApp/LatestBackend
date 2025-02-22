import express, { Router } from "express";
import { createPresignedURLStory} from "../../controllers/Story/Story/createPresignedURLStory";
import { deleteStory } from "../../controllers/Story/Story/deleteStory";
import { getAllStory } from "../../controllers/Story/Story/getAllStory";
import { createStory } from "../../controllers/Story/Story/createStory";


export const storyRoutes: Router = express.Router();

storyRoutes.route("/story")
    .post(createPresignedURLStory)
    .get(getAllStory)

storyRoutes.route("/story/:storyId")
    .post(createStory)
    .delete(deleteStory)




