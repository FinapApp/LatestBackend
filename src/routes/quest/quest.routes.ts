import express, { Router } from "express";
import { getAllQuests } from "../../controllers/Quest/Quests/getAllQuest";
import { deleteQuest } from "../../controllers/Quest/Quests/deleteQuest";
import { createPresignedURLQuestApplication } from "../../controllers/Quest/QuestApplicants/createPresignedURLQuestApplication";
import { createQuestApplicant } from "../../controllers/Quest/QuestApplicants/createQuestApplicants";
import { createQuest } from "../../controllers/Quest/Quests/createQuest";
import { createPresignedURLQuest } from "../../controllers/Quest/Quests/createPresignedURLQuest";
import { deleteQuestApplication } from "../../controllers/Quest/QuestApplicants/deleteQuestApplication";

export const questRoutes: Router = express.Router();

questRoutes.route("/quest")
    .post(createQuest)
    .get(getAllQuests)

questRoutes.route("/quest/:questId")
    .delete(deleteQuest)
    .put(createPresignedURLQuest)

questRoutes.route("/quest-applicant")
    .post(createQuestApplicant)

questRoutes.route("/quest-applicant/:questApplicantId")
    .put(createPresignedURLQuestApplication)
    .delete(deleteQuestApplication)