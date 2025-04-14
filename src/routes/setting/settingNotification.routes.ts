import express, { Router } from "express";
import { getUserNotificationSetting } from "../../controllers/Setting/Notification/getNotificationSetting";
import { updateNotificationSetting } from "../../controllers/Setting/Notification/updateNotificationSetting";


export const settingNotificationRoutes: Router = express.Router();





settingNotificationRoutes.route("/notification-setting")
    .get(getUserNotificationSetting)
    .put(updateNotificationSetting)

