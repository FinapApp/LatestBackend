import express, { Router } from "express";
import { updateTwoFactorAuth } from "../../controllers/Setting/TwoFactorAuth/updateTwoFactor";
import { getTwoFactorAuth } from "../../controllers/Setting/TwoFactorAuth/getTwoFactorAuth";


export const settingTwoFactorRoutes: Router = express.Router();



settingTwoFactorRoutes.route("/setting/two-factor-auth")
    .put(updateTwoFactorAuth)
    .get(getTwoFactorAuth)
