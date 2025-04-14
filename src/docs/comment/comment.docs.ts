// Comment on flicks

/**
 * @swagger
 * /v1/comment/{flickId}:
 *   post:
 *     summary: Create a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *           description: The ID of the flick
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["user", "text"]
 *                     mention:
 *                       type: string
 *                       pattern: "^[0-9a-fA-F]{24}$"
 *                       description: Optional mention ID
 *                     text:
 *                       type: string
 *                       description: Text of the comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully."
 *   get:
 *     summary: Get comments for a flick
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *           description: The ID of the flick
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     COMMENTSLIST:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67ec1d8db204e7180d9457a0"
 *                           user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67dae40b4e8ca90bf77de17a"
 *                               username:
 *                                 type: string
 *                                 example: "Jarvis0013"
 *                               photo:
 *                                 type: string
 *                                 example: "https://example.com/profile-image"
 *                           comment:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 type:
 *                                   type: string
 *                                   example: "user"
 *                                 mention:
 *                                   type: string
 *                                   example: "cebe6f6fc801b9c6b8871acd"
 *                                 text:
 *                                   type: string
 *                                   example: "string"
 */

// Comment on Parent Comment #REPLY


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



// Comment on Flick #REPLY
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