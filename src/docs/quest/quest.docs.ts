
/**
 * @swagger
 * /v1/quest:
 *   post:
 *     tags:
 *       - Quests
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
 *                 questId:
 *                   type: string
 *                   example: 'questId'
 *                 media:
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
 *   get:
 *     tags:
 *       - Quests
 *     summary: Get all quests
 *     responses:
 *       200:
 *         description: A list of quests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 quests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 'questId'
 *                       title:
 *                         type: string
 *                         example: 'Quest Title'
 *                       description:
 *                         type: string
 *                         example: 'Quest Description'
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
 * /v1/quest/{questId}:
 *   post:
 *     tags:
 *       - Quests
 *     summary: Create a new quest
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: The unique ID of the quest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["Exclusive", "Basic"]
 *                 example: "Exclusive"
 *               title:
 *                 type: string
 *                 example: "Updated Quest Title"
 *               description:
 *                 type: string
 *                 example: "Updated Quest Description"
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["photo", "video"]
 *                       example: "photo"
 *                     duration:
 *                       type: number
 *                       example: 120
 *                     audio:
 *                       type: string
 *                       pattern: "^[0-9a-fA-F]{24}$"
 *                       example: "60b8d295f1b2c72f9c8b4567"
 *                     alt:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Alternative text"
 *                     thumbnailURL:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/thumbnail.jpg"
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/media.jpg"
 *               mode:
 *                 type: string
 *                 enum: ["GoFlick", "OnFlick"]
 *                 example: "GoFlick"
 *               location:
 *                 type: string
 *                 example: "Updated Location"
 *               coords:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 40.7128
 *                   long:
 *                     type: number
 *                     example: -74.0060
 *               maxApplicants:
 *                 type: number
 *                 example: 150
 *               totalAmount:
 *                 type: number
 *                 example: 6000
 *     responses:
 *       200:
 *         description: Quest created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questId:
 *                   type: string
 *                   example: "questId"
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
 *   put:
 *     tags:
 *       - Quests
 *     summary: Update an existing quest
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: The unique ID of the quest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["Exclusive", "Basic"]
 *                 example: "Exclusive"
 *               title:
 *                 type: string
 *                 example: "Updated Quest Title"
 *               description:
 *                 type: string
 *                 example: "Updated Quest Description"
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: ["photo", "video"]
 *                       example: "photo"
 *                     duration:
 *                       type: number
 *                       example: 120
 *                     audio:
 *                       type: string
 *                       pattern: "^[0-9a-fA-F]{24}$"
 *                       example: "60b8d295f1b2c72f9c8b4567"
 *                     alt:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Alternative text"
 *                     thumbnailURL:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/thumbnail.jpg"
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/media.jpg"
 *               mode:
 *                 type: string
 *                 enum: ["GoFlick", "OnFlick"]
 *                 example: "GoFlick"
 *               location:
 *                 type: string
 *                 example: "Updated Location"
 *               coords:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 40.7128
 *                   long:
 *                     type: number
 *                     example: -74.0060
 *               maxApplicants:
 *                 type: number
 *                 example: 150
 *               totalAmount:
 *                 type: number
 *                 example: 6000
 *     responses:
 *       200:
 *         description: Quest updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questId:
 *                   type: string
 *                   example: "questId"
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
 *       - Quests
 *     summary: Delete a quest
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
 *         description: Quest deleted successfully
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
 *                   example: "Quest deleted successfully"
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
 */



/**
 * @swagger
 * /v1/quest:
 *   post:
 *     tags:
 *       - Quests
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
 *                 questId:
 *                   type: string
 *                   example: 'questId'
 *                 media:
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
 *   get:
 *     tags:
 *       - Quests
 *     summary: Get all quests
 *     responses:
 *       200:
 *         description: A list of quests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 quests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 'questId'
 *                       title:
 *                         type: string
 *                         example: 'Quest Title'
 *                       description:
 *                         type: string
 *                         example: 'Quest Description'
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
 * /v1/quest/{questId}:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Amazing Quest"
 *               description:
 *                 type: string
 *                 example: "This is a challenging and fun quest."
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                   example: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/song/67d0b6d2f1d6bb88fde0d962/1733091882152-8653235423482524-1730755306564-8543577671062357-Screenshot%202024-10-03%20at%202.10.40%E2%80%AFAM.png"
 *               thumbnailURL:
 *                 type: string
 *                 format: uri
 *                 example: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/song/67d0b6d2f1d6bb88fde0d962/1733091882152-8653235423482524-1730755306564-8543577671062357-Screenshot%202024-10-03%20at%202.10.40%E2%80%AFAM.png"
 *               mode:
 *                 type: string
 *                 enum: ["GoFlick", "OnFlick"]
 *                 example: "GoFlick"
 *               location:
 *                 type: string
 *                 example: "Central Park, NYC"
 *               coords:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 40.785091
 *                   long:
 *                     type: number
 *                     example: -73.968285
 *               maxApplicants:
 *                 type: number
 *                 example: 10
 *               totalAmount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Quest created
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
 *                   example: "Quest created successfully"
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
 *                   example: "Quest deleted successfully"
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
 */


/**
 * @swagger
 * /v1/quest-applicant/{questId}:
 *   get:
 *     tags:
 *       - [Quests Applicants]
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