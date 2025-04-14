
/**
 * @swagger
 * /v1/story-view/{storyId}:
 *   get:
 *     tags:
 *       - StoryViews
 *     summary: Get viewers of a story
 *     description: Retrieve a list of viewers for a specific story by its ID.
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the story
 *     responses:
 *       200:
 *         description: A list of viewers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   viewerId:
 *                     type: string
 *                   viewerName:
 *                     type: string
 *       404:
 *         description: Story not found
 * 
 *   post:
 *     tags:
 *       - StoryViews
 *     summary: Add a viewer to a story
 *     description: Add a viewer to the list of viewers for a specific story by its ID.
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the story
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *     responses:
 *       200:
 *         description: Viewer added successfully
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
 *                   example: 'Viewer added successfully'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred
 */