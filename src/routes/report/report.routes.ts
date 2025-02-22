import express, { Router } from "express";
import { reportComment } from "../../controllers/Reports/reportComment";
import { reportFlick } from "../../controllers/Reports/reportFlick";


export const reportRoutes: Router = express.Router();

reportRoutes.post("/report-comment/:commentId", reportComment)
reportRoutes.post("/report-flick/:flickId", reportFlick)
reportRoutes.post("/report-user/:userId", reportFlick)




