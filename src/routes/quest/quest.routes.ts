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
import { changeQuestApplicantStatus } from "../../controllers/Quest/QuestApplicants/changeQuestApplicantStatus";
import { getQuest } from "../../controllers/Quest/Quests/getQuest";
import { getQuestApplicant } from "../../controllers/Quest/QuestApplicants/getQuestApplicant";
import { updateQuestApplicant } from "../../controllers/Quest/QuestApplicants/updateQuestApplicant";
import { bulkChangeStatus } from "../../controllers/Quest/QuestApplicants/bulkChangeStatus";
import { changeVerifyStatusQRApplicant } from "../../controllers/Quest/QuestApplicants/changeVerifyStatusQRApplicant";

export const questRoutes: Router = express.Router();

questRoutes.route("/quest")
    .post(createPresignedURLQuest)
    .get(getAllQuests);


questRoutes.route("/quest/:questId")
    .get(getQuest)
    .post(createQuest)
    .delete(deleteQuest)
    .put(updateQuest)


questRoutes.route("/quest-applicant")
    .post(createPresignedURLQuestApplication)


questRoutes.route("/quest/:questId/applicant")
    .get(getAllQuestApplicant)
    .put(bulkChangeStatus)

questRoutes.route("/quest-applicant/:questApplicantId")
    .get(getQuestApplicant)
    .post(createQuestApplicant)
    .delete(deleteQuestApplication)
    .patch(changeQuestApplicantStatus)
    .put(updateQuestApplicant)

questRoutes.post("/quest-applicant/:questApplicantId/qr", changeVerifyStatusQRApplicant)


