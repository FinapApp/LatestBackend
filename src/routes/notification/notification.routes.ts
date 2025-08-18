import express, { Router } from "express";
import { getNotifications } from "../../controllers/Notification/getNotification";
import { deleteNotification } from "../../controllers/Notification/deleteNotification";

export const notificationRoutes: Router = express.Router();



notificationRoutes.get("/notification", getNotifications);

notificationRoutes.delete("/notification/:notificationId", deleteNotification);

