import express, { Router } from "express";
import { getProfileDetails } from "../../controllers/Setting/Profile/getPersonalDetails";
import { createPresignedURLProfile } from "../../controllers/Setting/Profile/createPresignedURLProfile";
import { updateProfileDetails } from "../../controllers/Setting/Profile/updateProfileDetails";
import { updatePassword } from "../../controllers/Setting/Profile/updatePassword";


export const settingProfile: Router = express.Router();

settingProfile.post("/profile-picture", createPresignedURLProfile);

settingProfile
    .route("/profile-detail")
    .put(updateProfileDetails)
    .get(getProfileDetails);


settingProfile.put("/setting/password", updatePassword);
