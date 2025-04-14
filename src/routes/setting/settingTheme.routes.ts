
import express, { Router } from "express";
import { updateTheme } from "../../controllers/Setting/Theme/updateTheme";
import { getTheme } from "../../controllers/Setting/Theme/getTheme";


export const settingThemeRoutes: Router = express.Router();


settingThemeRoutes.route("/setting/theme")
    .put(updateTheme)
    .get(getTheme)