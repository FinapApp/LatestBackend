import express, { Router } from "express";
import { getAllQuests } from "../../controllers/Quest/Quests/getAllQuest";
import { deleteQuest } from "../../controllers/Quest/Quests/deleteQuest";
import { createPresignedURLQuestApplication } from "../../controllers/Quest/QuestApplicants/createPresignedURLQuestApplication";
import { createQuestApplicant } from "../../controllers/Quest/QuestApplicants/createQuestApplicants";
import { createQuest } from "../../controllers/Quest/Quests/createQuest";
import { createPresignedURLQuest } from "../../controllers/Quest/Quests/createPresignedURLQuest";
import { deleteQuestApplication } from "../../controllers/Quest/QuestApplicants/deleteQuestApplication";
import { updateQuest } from "../../controllers/Quest/Quests/updateQuest";
import { getAllQuestApplicant } from "../../controllers/Quest/QuestApplicants/getAllQuestApplicants";

export const questRoutes: Router = express.Router();

questRoutes.route("/quest")
    .post(createPresignedURLQuest)
    .get(getAllQuests);


questRoutes.route("/quest/:questId")
    .post(createQuest)
    .delete(deleteQuest)
    .put(updateQuest)


questRoutes.route("/quest-applicant")
    .post(createPresignedURLQuestApplication);


questRoutes.get("/quest-applicant/:questId", getAllQuestApplicant);

questRoutes.route("/quest-applicant/:questApplicantId")
    .post(createQuestApplicant)
    .delete(deleteQuestApplication)

