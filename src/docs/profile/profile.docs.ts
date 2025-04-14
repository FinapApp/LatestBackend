
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get profile details
 *     description: Retrieve profile details. If `userId` is not provided in the query, it will return a default response.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the user whose profile details are to be retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved profile details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: The profile details.
 *       400:
 *         description: Bad request.
 */