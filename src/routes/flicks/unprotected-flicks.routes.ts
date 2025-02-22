import express, { Router } from "express";
import { getFlick } from "../../controllers/Flicks/getFlick";


export const flickRoutes: Router = express.Router();

flickRoutes.get("/flick/:flickId", getFlick)
