import express, { Router } from "express";
import { getProfileDetails } from "../../controllers/Setting/Profile/getPersonalDetails";
import { createPresignedURLProfile } from "../../controllers/Setting/Profile/createPresignedURLProfile";
import { updateProfileDetails } from "../../controllers/Setting/Profile/updateProfileDetails";
import { updatePassword } from "../../controllers/Setting/Profile/updatePassword";
import { deleteProfilePicture } from "../../controllers/Profile/deleteProfilePicture";


export const settingProfile: Router = express.Router();

settingProfile.route("/profile-picture")
    .post(createPresignedURLProfile)
    .delete(deleteProfilePicture)


settingProfile
    .route("/profile-detail")
    .put(updateProfileDetails)
    .get(getProfileDetails);


settingProfile.put("/setting/password", updatePassword);
