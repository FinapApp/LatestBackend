import express, { Router } from "express";
import { getAllQuests } from "../../controllers/Quest/Quests/getAllQuest";
import { deleteQuest } from "../../controllers/Quest/Quests/deleteQuest";
import { createPresignedURLQuestApplication } from "../../controllers/Quest/QuestApplicants/createPresignedURLQuestApplication";
import { createQuestApplicant } from "../../controllers/Quest/QuestApplicants/createQuestApplicants";
import { createQuest } from "../../controllers/Quest/Quests/createQuest";
import { createPresignedURLQuest } from "../../controllers/Quest/Quests/createPresignedURLQuest";
import { deleteQuestApplication } from "../../controllers/Quest/QuestApplicants/deleteQuestApplication";

export const questRoutes: Router = express.Router();

/**
 * @swagger
 * /quest:
 *   post:
 *     tags: 
 *       - Quests
 *     summary: Create a presigned URL for a quest
 *     responses:
 *       200:
 *         description: Presigned URL created
 *   get:
 *     tags: 
 *       - Quests
 *     summary: Get all quests
 *     responses:
 *       200:
 *         description: A list of quests
 */
questRoutes.route("/quest")
    .post(createPresignedURLQuest)
    .get(getAllQuests)

/**
 * @swagger
 * /quest/{questId}:
 *   post:
 *     tags: 
 *       - Quests
 *     summary: Create a quest
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quest created
 *   delete:
 *     tags: 
 *       - Quests
 *     summary: Delete a quest
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quest deleted
 */
questRoutes.route("/quest/:questId")
    .post(createQuest)
    .delete(deleteQuest)

/**
 * @swagger
 * /quest-applicant:
 *   post:
 *     tags: 
 *       - Quests
 *     summary: Create a quest applicant
 *     responses:
 *       200:
 *         description: Quest applicant created
 */
questRoutes.route("/quest-applicant")
    .post(createQuestApplicant)

/**
 * @swagger
 * /quest-applicant/{questApplicantId}:
 *   put:
 *     tags: 
 *       - Quests
 *     summary: Create a presigned URL for a quest applicant
 *     parameters:
 *       - in: path
 *         name: questApplicantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Presigned URL created
 *   delete:
 *     tags: 
 *       - Quests
 *     summary: Delete a quest applicant
 *     parameters:
 *       - in: path
 *         name: questApplicantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quest applicant deleted
 */
questRoutes.route("/quest-applicant/:questApplicantId")
    .put(createPresignedURLQuestApplication)
    .delete(deleteQuestApplication)
