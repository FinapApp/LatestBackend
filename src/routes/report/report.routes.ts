import express, { Router } from "express";
import { reportComment } from "../../controllers/Reports/reportComment";
import { reportFlick } from "../../controllers/Reports/reportFlick";
import { createPresignedURLReport } from "../../controllers/Reports/createPresignedURLReport";
import { reportStory } from "../../controllers/Reports/reportStory";
import { reportAudio } from "../../controllers/Reports/reportAudio";
import { reportUser } from "../../controllers/Reports/reportUser";

export const reportRoutes: Router = express.Router();

reportRoutes.post("/report/presigned-url", createPresignedURLReport);

reportRoutes.post("/report-comment/:commentId", reportComment);

reportRoutes.post("/report-flick/:flickId", reportFlick);


reportRoutes.post("/report-user/:userId", reportUser);

reportRoutes.post("/report-story/:storyId", reportStory);

reportRoutes.post("/report-audio/:audioId", reportAudio);