import express, { Router } from "express";
import { createFeedback } from "../../controllers/Feedback/createFeedback";
import { deleteFeedback } from "../../controllers/Feedback/deleteFeedback";
import { updateFeedback } from "../../controllers/Feedback/updateFeedback";
import { getAllFeedBacks } from "../../controllers/Feedback/getFeedbacks";



// REDIRECTION TO THE APP STORE IF NOT THIS MAYBE
export const feedbackRoutes : Router = express.Router();

feedbackRoutes.route("/feedback")
    .post(createFeedback)
    .get(getAllFeedBacks)

feedbackRoutes.route("/feedback/:feedbackId")
    .put(updateFeedback)
    .delete(deleteFeedback)