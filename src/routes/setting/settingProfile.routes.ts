import express, { Router } from "express";
import { getProfile } from "../../controllers/Setting/Profile/getProfile";
import { createPresignedURLProfile } from "../../controllers/Setting/Profile/createPresignedURLProfile";
import { updateProfile } from "../../controllers/Setting/Profile/updateProfile";
import { updatePassword } from "../../controllers/Setting/Profile/updatePassword";


export const settingProfile: Router = express.Router();





/**
 * @swagger
 * /v1/profile:
 *   post:
 *     tags: 
 *       - Profile
 *     summary: Create a presigned URL for uploading a profile photo
 *     requestBody:
 *       description: Object containing file type for the profile photo
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileType:
 *                 type: string
 *                 example: 'image/jpeg'
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
 *                 presignedURL:
 *                   type: string
 *                   example: 'https://example.com/presigned-url'
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
 *   put:
 *     tags: 
 *       - Profile
 *     summary: Update user profile
 *     requestBody:
 *       description: Object containing user profile details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John'
 *               surname:
 *                 type: string
 *                 example: 'Doe'
 *               gender:
 *                 type: string
 *                 example: 'Male'
 *               phone:
 *                 type: string
 *                 example: '+1234567890'
 *               username:
 *                 type: string
 *                 example: 'johndoe'
 *               dob:
 *                 type: string
 *                 example: '1990-01-01'
 *               country:
 *                 type: string
 *                 example: 'US'
 *               photo:
 *                 type: string
 *                 example: 'https://example.com/photo.jpg'
 *     responses:
 *       200:
 *         description: Successfully updated profile
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
 *                   example: Profile updated successfully
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
 *       - Profile
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
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
 *                     name:
 *                       type: string
 *                       example: 'John'
 *                     surname:
 *                       type: string
 *                       example: 'Doe'
 *                     gender:
 *                       type: string
 *                       example: 'Male'
 *                     phone:
 *                       type: string
 *                       example: '+1234567890'
 *                     username:
 *                       type: string
 *                       example: 'johndoe'
 *                     dob:
 *                       type: string
 *                       example: '1990-01-01'
 *                     country:
 *                       type: string
 *                       example: 'US'
 *                     photo:
 *                       type: string
 *                       example: 'https://example.com/photo.jpg'
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

settingProfile.route("/profile")
    .post(createPresignedURLProfile)
    .put(updateProfile)
    .get(getProfile)




settingProfile.put("/password",updatePassword)
    


