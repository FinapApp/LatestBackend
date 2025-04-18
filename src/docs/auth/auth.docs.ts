// Login Request

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication related endpoints
 * /login:
 *   post:
 *     summary: Login a user with their credentials
 *     tags: [Auth]
 *     requestBody:
 *       description: Email, Password and FCMToken for login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'dcode.0n1@gmail.com'
 *               password:
 *                 type: string
 *                 example: 'jalwa'
 *               fcmToken:
 *                 type: string    
 *                 example: "fcmTokenstring"
 *     responses:
 *       200:
 *         description: Successfully Logged In
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M4MzI2NmEyNzg2YmIzMjNiMzQ3YjMiLCJpYXQiOjE3NDExNzMzNzcsImV4cCI6MTc0MTI1OTc3N30.wU0r8GYlmDeunA4XGTNzkWey1aYpKPYy7a88Sylevg8"
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M4MzI2NmEyNzg2YmIzMjNiMzQ3YjMiLCJpYXQiOjE3NDExNzMzNzcsImV4cCI6MTc0MTI1OTc3N30.wU0r8GYlmDeunA4XGTNzkWey1aYpKPYy7a88Sylevg8"
 *       400:
 *         description: Invalid Credentials
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
 *                   example: Invalid Credentials
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


// Revalidate the sessions 
/**
 * @swagger
 * /revalidate:
 *   post:
 *     summary: Revalidate a session with a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       description: Refresh token for session revalidation
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M4MzI2NmEyNzg2YmIzMjNiMzQ3YjMiLCJpYXQiOjE3NDExNzMzNzcsImV4cCI6MTc0MTI1OTc3N30.wU0r8GYlmDeunA4XGTNzkWey1aYpKPYy7a88Sylevg8"
 *     responses:
 *       200:
 *         description: Successfully revalidated session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M4MzI2NmEyNzg2YmIzMjNiMzQ3YjMiLCJpYXQiOjE3NDExNzMzNzcsImV4cCI6MTc0MTI1OTc3N30.wU0r8GYlmDeunA4XGTNzkWey1aYpKPYy7a88Sylevg8"
 *       400:
 *         description: Invalid refresh token
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
 *                   example: Invalid refresh token
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


// Logout Request
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully Logged Out
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
 *                   example: Successfully Logged Out
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