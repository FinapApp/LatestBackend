import express, { Router } from "express";
import { createFeedback } from "../../controllers/Feedback/createFeedback";
import { deleteFeedback } from "../../controllers/Feedback/deleteFeedback";
import { updateFeedback } from "../../controllers/Feedback/updateFeedback";



// REDIRECTION TO THE APP STORE IF NOT THIS MAYBE
export const feedbackRoutes : Router = express.Router();

feedbackRoutes.route("/feedback")
    .post(createFeedback)


feedbackRoutes.route("/feedback/:feedbackId")
    .post(deleteFeedback)
    .delete(updateFeedback)