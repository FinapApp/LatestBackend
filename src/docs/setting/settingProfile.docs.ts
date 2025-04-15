
/**
 * @swagger
 * /v1/profile-picture:
 *   post:
 *     summary: Generate a presigned URL for uploading a profile picture
 *     tags:
 *       - Profile Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileType:
 *                 type: string
 *                 description: The type of the file to be uploaded (e.g., image/jpeg, image/png)
 *                 example: image/jpeg
 *     responses:
 *       200:
 *         description: Successfully generated presigned URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The presigned URL for uploading the file
 *                   example: https://example-bucket.s3.amazonaws.com/example.jpg?AWSAccessKeyId=...
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */




/**
 * @swagger
 * /v1/profile-detail:
 *   put:
 *     summary: Update personal details
 *     tags:
 *       - Profile Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               gender:
 *                 type: string
 *                 description: User's gender
 *               phone:
 *                 type: string
 *                 description: User's phone number in international format
 *               username:
 *                 type: string
 *                 description: User's username
 *               dob:
 *                 type: string
 *                 description: User's date of birth
 *               country:
 *                 type: string
 *                 description: User's country code
 *               photo:
 *                 type: string
 *                 description: URL of the user's profile photo
 *               description:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mention:
 *                       type: string
 *                       description: Mentioned user ID (ObjectId format)
 *                       example: 507f1f77bcf86cd799439011
 *                     text:
 *                       type: string
 *                       description: Text associated with the mention or normal text
 *           example:
 *             name: "Rakshak Khandelwal"
 *             email: "dcode.0n1@example.com"
 *             gender: "Male"
 *             phone: "6376877564"
 *             username: "jarvis0013"
 *             dob: "1999-05-13"
 *             country: "IN"
 *             photo: "https://pub-301c1efdf41d428f9ab043c4d4ecbac9.r2.dev/some-random-path/profile-image"
 *             description:
 *               - mention: "507f1f77bcf86cd799439011"
 *                 text: "@chirag"
 *               - mention: "507f1f77bcf86cd799439011"
 *                 text: "@lovesh"
 *               - text: "is great guys"
 *     responses:
 *       200:
 *         description: Successfully updated personal details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get personal details
 *     tags:
 *       - Profile Setting
 *     responses:
 *       200:
 *         description: Successfully retrieved personal details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                 gender:
 *                   type: string
 *                   description: User's gender
 *                 phone:
 *                   type: string
 *                   description: User's phone number in international format
 *                 username:
 *                   type: string
 *                   description: User's username
 *                 dob:
 *                   type: date
 *                   description: User's date of birth
 *                 country:
 *                   type: string
 *                   description: User's country code
 *                 photo:
 *                   type: string
 *                   description: URL of the user's profile photo
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /v1/setting/password:
 *   put:
 *     summary: Update user password
 *     tags:
 *       - Profile Setting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The current password of the user
 *                 example: currentPassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */