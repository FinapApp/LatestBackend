
import express, { Router } from "express";
import { getProfileDetail } from "../../controllers/Profile/getProfileDetail";
import { isAuthenticatedUserIfNot } from "../../middlewares/isAuthenticatedIUserfNot";



export const unprotectedProfileRoutes: Router = express.Router();

unprotectedProfileRoutes.get("/profile", isAuthenticatedUserIfNot, getProfileDetail)