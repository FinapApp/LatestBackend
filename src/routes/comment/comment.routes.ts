import express, { Router } from "express";
import { createComment } from "../../controllers/Comment/createComment";
import { deleteComment } from "../../controllers/Comment/common/deleteComment";
import { getComments } from "../../controllers/Comment/getComments";
import { getComment } from "../../controllers/Comment/getComment";
import { createReplyComment } from "../../controllers/Comment/Individual/createReplyComment";
import { updateReplyComment } from "../../controllers/Comment/Individual/updateReplyComment";

export const commentRoutes: Router = express.Router();

/**
 * @swagger
 * /v1/comment/{flickId}:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flick
 *       - in: body
 *         name: comment
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ["user"]
 *                     example: "user"
 *                   mention:
 *                     type: string
 *                     pattern: "^[0-9a-fA-F]{24}$"
 *                     example: "60d21b4667d0d8992e610c85"
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ["text"]
 *                     example: "text"
 *                   text:
 *                     type: string
 *                     example: "This is a sample text comment."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully."
 *                 comment:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "user"
 *                         mention:
 *                           type: string
 *                           example: "60d21b4667d0d8992e610c85"
 *                     - type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "text"
 *                         text:
 *                           type: string
 *                           example: "This is a sample text comment."
 *   get:
 *     summary: Get all comments for a flick
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flick
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "user"
 *                       mention:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                   - type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "text"
 *                       text:
 *                         type: string
 *                         example: "This is a sample text comment."
 */
commentRoutes.route("/comment/:flickId")
    .post(createComment)
    .get(getComments);

/**
 * @swagger
 * /v1/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: A comment object
 *   put:
 *     summary: Update a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *       - in: body
 *         name: comment
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ["user"]
 *                     example: "user"
 *                   mention:
 *                     type: string
 *                     pattern: "^[0-9a-fA-F]{24}$"
 *                     example: "60d21b4667d0d8992e610c85"
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ["text"]
 *                     example: "text"
 *                   text:
 *                     type: string
 *                     example: "This is a sample text comment."
 *     responses:
 *       200:
 *         description: Reply comment updated successfully
 */
commentRoutes.route("/comment/:commentId")
    .delete(deleteComment)
    .put(updateReplyComment)
    .get(getComment);

/**
 * @swagger
 * /comment/{flickId}/{commentId}:
 *   post:
 *     summary: Create a reply to a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flick
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment being replied to
 *     responses:
 *       201:
 *         description: Reply comment created successfully
 */
commentRoutes.route("/comment/:flickId/:commentId")
    .post(createReplyComment);
