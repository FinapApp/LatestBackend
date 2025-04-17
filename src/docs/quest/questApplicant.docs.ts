
/**
 * @swagger
 * /v1/quest/{questId}/applicant:
 *   get:
 *     tags:
 *       - Quests Applicants
 *     summary: Get all quest applicants for a specific quest
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: The unique ID of the quest
 *     responses:
 *       200:
 *         description: A list of quest applicants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 applicants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "applicantId"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://example.com/media.jpg"
 *       400:
 *         description: Invalid quest ID
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
 *                   example: "Invalid quest ID"
 *       500:
 *         description: An error occurred on the server
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
 *                   example: "An internal server error occurred"
 */



/**
 * @swagger
 * /v1/quest-applicant:
 *   post:
 *     tags:
 *       - [Quests Applicants]
 *     summary: Create a presigned URL for a quest
 *     requestBody:
 *       description: Object containing media details for the flick
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                       example: 'video.mp4'
 *                     fileType:
 *                       type: string
 *                       example: 'video/mp4'
 *     responses:
 *       200:
 *         description: Successfully created presigned URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questApplicantId:
 *                   type: string
 *                   example: 'questId'
 *                 MEDIASIGNED:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: 'url1'
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



/**
 * @swagger
 * /v1/quest-applicant/{questApplicantId}:
 *
 *   patch:
 *     tags:
 *       - [Quests Applicants]
 *     summary: Change status of a quest applicant
 *     parameters:
 *       - in: path
 *         name: questApplicantId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: The ID of the quest applicant
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [approved, rejected]
 *         description: The status to update the applicant to
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                   example: "Status updated successfully"
 *       400:
 *         description: Validation error or invalid status
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
 *                   example: "Invalid status or parameters"
 *       404:
 *         description: Quest applicant or quest not found
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
 *                   example: "Quest applicant not found"
 *       500:
 *         description: Server error
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
 *                   example: "An internal server error occurred"
 *   post:
 *     tags:
 *       - [Quests Applicants]
 *     summary: Create a quest applicant
 *     parameters:
 *       - in: path
 *         name: questApplicantId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: The unique ID of the quest applicant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quest:
 *                 type: string
 *                 pattern: "^[0-9a-fA-F]{24}$"
 *                 example: "60b8d295f1b2c72f9c8b4567"
 *                 description: The unique ID of the quest
 *               description:
 *                 type: array
 *                 description: An array of descriptions, which may include text or user mentions.
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["user", "text"]
 *                       example: "text"
 *                     mention:
 *                       type: string
 *                       pattern: "^[0-9a-fA-F]{24}$"
 *                       example: "60b8d295f1b2c72f9c8b4568"
 *                     text:
 *                       type: string
 *                       example: "This is a sample description"
 *               partialAllowance:
 *                 type: boolean
 *                 example: true
 *                 description: Whether partial payments are allowed
 *               media:
 *                 type: array
 *                 description: List of media files included in the quest application
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/song/67d0b6d2f1d6bb88fde0d962/1733091882152-8653235423482524-1730755306564-8543577671062357-Screenshot%202024-10-03%20at%202.10.40%E2%80%AFAM.png"
 *                       description: The URL of the media file
 *                     thumbnail:
 *                       type: string
 *                       format: uri
 *                       example: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/song/67d0b6d2f1d6bb88fde0d962/1733091882152-8653235423482524-1730755306564-8543577671062357-Screenshot%202024-10-03%20at%202.10.40%E2%80%AFAM.png"
 *                       description: The thumbnail URL for the media file
 *                     type:
 *                       type: string
 *                       enum: ["photo", "video", "audio", "pdf"]
 *                       example: "photo"
 *                       description: Type of media file
 *     responses:
 *       200:
 *         description: Quest applicant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questApplicantId:
 *                   type: string
 *                   example: "questApplicantId"
 *       400:
 *         description: Invalid request parameters
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
 *                   example: "Invalid request parameters"
 *       500:
 *         description: An error occurred on the server
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
 *                   example: "An internal server error occurred"
 *   delete:
 *     tags:
 *       - [Quests Applicants]
 *     summary: Delete a quest
 *     parameters:
 *       - in: path
 *         name: questApplicantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quest Applicant deleted
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
 *                   example: "Quest Applicant deleted successfully"
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
 *                   example: "Invalid request parameters"
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
 *                   example: "An error occurred"
 *   get:
 *     tags:
 *       - [Quests Applicants]
 *     summary: Get a specific quest applicant by ID
 *     parameters:
 *       - in: path
 *         name: questApplicantId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: The ID of the quest applicant
 *     responses:
 *       200:
 *         description: Quest applicant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questApplicant:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60b8d295f1b2c72f9c8b4567"
 *                     quest:
 *                       type: string
 *                       example: "60b8d295f1b2c72f9c8b4568"
 *                     description:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: ["user", "text"]
 *                           mention:
 *                             type: string
 *                           text:
 *                             type: string
 *                     partialAllowance:
 *                       type: boolean
 *                       example: true
 *                     media:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                             format: uri
 *                           thumbnail:
 *                             type: string
 *                             format: uri
 *                           type:
 *                             type: string
 *                             enum: ["photo", "video", "audio", "pdf"]
 *       400:
 *         description: Invalid questApplicantId
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
 *                   example: "Invalid ID format"
 *       404:
 *         description: Quest applicant not found
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
 *                   example: "Quest applicant not found"
 *       500:
 *         description: Server error
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
 *                   example: "An internal server error occurred"
 *   put:
 *     tags:
 *       - [Quests Applicants]
 *     summary: Update a quest applicant
 *     parameters:
 *       - in: path
 *         name: questApplicantId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: The ID of the quest applicant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quest:
 *                 type: string
 *                 pattern: "^[0-9a-fA-F]{24}$"
 *                 example: "60b8d295f1b2c72f9c8b4567"
 *               description:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["user", "text"]
 *                       example: "text"
 *                     mention:
 *                       type: string
 *                       example: "60b8d295f1b2c72f9c8b4568"
 *                     text:
 *                       type: string
 *                       example: "This is a sample description"
 *               partialAllowance:
 *                 type: boolean
 *                 example: true
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                     thumbnail:
 *                       type: string
 *                       format: uri
 *                     type:
 *                       type: string
 *                       enum: ["photo", "video", "audio", "pdf"]
 *     responses:
 *       200:
 *         description: Quest applicant updated successfully
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
 *                   example: "Quest applicant updated"
 *       400:
 *         description: Validation error
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
 *                   example: "Invalid data or request"
 *       404:
 *         description: Quest applicant not found
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
 *                   example: "Quest applicant not found"
 *       500:
 *         description: Server error
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
 *                   example: "An internal server error occurred"
 */

