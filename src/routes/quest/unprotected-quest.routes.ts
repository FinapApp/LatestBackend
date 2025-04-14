import express, { Router } from "express";
import { getAllQuests } from "../../controllers/Quest/Quests/getAllQuest";
import { deleteQuest } from "../../controllers/Quest/Quests/deleteQuest";
import { createQuest } from "../../controllers/Quest/Quests/createQuest";
import { createPresignedURLQuest } from "../../controllers/Quest/Quests/createPresignedURLQuest";

export const questRoutes: Router = express.Router();

questRoutes.route("/quest")
    .post(createPresignedURLQuest)
    .get(getAllQuests);


questRoutes.route("/quest/:questId")
    .post(createQuest)
    .delete(deleteQuest);

