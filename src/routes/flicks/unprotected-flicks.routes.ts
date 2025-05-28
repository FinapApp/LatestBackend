import express, { Router } from "express";
import { getFlick } from "../../controllers/Flicks/getFlick";
import { isAuthenticatedUserIfNot } from "../../middlewares/isAuthenticatedIUserfNot";


export const flickRoutes: Router = express.Router();


flickRoutes.get("/flick/:flickId",isAuthenticatedUserIfNot, getFlick)
