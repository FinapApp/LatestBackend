
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
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date-asc, date-desc, amount-asc, amount-desc]
 *         description: Sort order for the quests
 *       - in: query
 *         name: low
 *         schema:
 *           type: string
 *         description: Lower bound for filtering
 *       - in: query
 *         name: high
 *         schema:
 *           type: string
 *         description: Upper bound for filtering
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [go, on]
 *         description: Mode of the quest
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [sponsored, self, applied ,favorite]
 *         description: Type of the quest
 *       - in: query
 *         name: lat
 *         schema:
 *           type: string
 *         description: Latitude for geolocation
 *       - in: query
 *         name: long
 *         schema:
 *           type: string
 *         description: Longitude for geolocation
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Country for filtering seperate by comma
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Country for filtering
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
 *   get:
 *     tags:
 *       - Quests
 *     summary: Get a quest by ID
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *           example: "questId"
 *         description: The unique ID of the quest
 *     responses:
 *       200:
 *         description: Quest details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 quest:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "questId"
 *                     title:
 *                       type: string
 *                       example: "Amazing Quest"
 *                     description:
 *                       type: string
 *                       example: "This is a challenging and fun quest."
 *                     location:
 *                       type: string
 *                       example: "Central Park, NYC"
 *                     coords:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 40.785091
 *                         long:
 *                           type: number
 *                           example: -73.968285
 *                     maxApplicants:
 *                       type: number
 *                       example: 10
 *                     totalAmount:
 *                       type: number
 *                       example: 500
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
 *                   example: "Invalid quest ID"
 *
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
 *
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
 *   put:
 *     tags:
 *       - Quests
 *     summary: Update a quest by ID
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
 *         description: Quest updated successfully
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
 *                   example: "Quest updated successfully"
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
