import express, { Router } from "express";
import { getStoryViewers } from "../../controllers/Story/StoryView/getStoryViewers";
import { addStoryViewer } from "../../controllers/Story/StoryView/addStoryViewers";


export const storyRoutes: Router = express.Router();

storyRoutes.route("/story-view/:storyId")
    .get(getStoryViewers)
    .post(addStoryViewer)
