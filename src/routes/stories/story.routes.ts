import express, { Router } from "express";
import { createPresignedURLStory} from "../../controllers/Story/Story/createPresignedURLStory";
import { deleteStory } from "../../controllers/Story/Story/deleteStory";
import { getAllStory } from "../../controllers/Story/Story/getAllStory";
import { createStory } from "../../controllers/Story/Story/createStory";


export const storyRoutes: Router = express.Router();





/**
 * @swagger
 * /story:
 *   post:
 *     tags: 
 *       - Stories
 *     summary: Create a presigned URL for a story
 *     responses:
 *       200:
 *         description: Presigned URL created successfully
 *   get:
 *     tags: 
 *       - Stories
 *     summary: Get all stories
 *     responses:
 *       200:
 *         description: A list of stories
 */

storyRoutes.route("/story")
    .post(createPresignedURLStory)
    .get(getAllStory)






/**
 * @swagger
 * /story/{storyId}:
 *   post:
 *     tags: 
 *       - Stories
 *     summary: Create a story
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story created successfully
 *   delete:
 *     tags: 
 *       - Stories
 *     summary: Delete a story
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story deleted successfully
 */

storyRoutes.route("/story/:storyId")
    .post(createStory)
    .delete(deleteStory)




