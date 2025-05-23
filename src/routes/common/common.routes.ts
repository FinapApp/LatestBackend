import express, { Router } from "express";
import { checkEmailExist } from "../../controllers/Onboarding/checkEmailExist";
import { checkUserNameExist } from "../../controllers/Onboarding/checkUsernameExist";
import { getHashTag } from "../../controllers/HashTags/getHashTags";
import { getMentions } from "../../controllers/Mention/getMentions";
// REDIRECTION TO THE APP STORE IF NOT THIS MAYBE
export const commonRoutes : Router = express.Router();
commonRoutes.post("/check-username", checkUserNameExist);
commonRoutes.post("/check-email", checkEmailExist);
commonRoutes.get("/hashtag" , getHashTag)
commonRoutes.get("/mention" , getMentions)