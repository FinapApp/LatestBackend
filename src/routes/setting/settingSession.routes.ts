
import express, { Router } from "express";
import { getSessions } from "../../controllers/Session/getSessions";
import { deleteSession } from "../../controllers/Session/deleteSession";
import { deleteSessions } from "../../controllers/Session/deleteSessions";


export const settingSessionRoutes: Router = express.Router();

settingSessionRoutes.route("/session")
    .get(getSessions)
    .delete(deleteSessions);

settingSessionRoutes.route("/session/:sessionId")
    .delete(deleteSession);