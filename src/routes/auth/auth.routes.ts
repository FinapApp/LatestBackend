import express, { Router } from "express";
import { login } from "../../controllers/Auth/login";
import { forgetPassword } from "../../controllers/ForgetPassword/forgetPassword";
import { logout } from "../../controllers/Auth/logout";
import { revalidateSessions } from "../../controllers/Auth/revalidateSessions";

export const authRoutes: Router = express.Router();

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
authRoutes.post("/login", login);

/**
 * @swagger
 * /forget-password:
 *   post:
 *     summary: Forget Password
 *     tags: [Auth]
 *     requestBody:
 *       description: Have an identifier for it could be your username ,phoneNumber or email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: 'dcode.0n1@gmail.com'
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
 *                 message:
 *                   type: string
 *                   example: "OTP has been sent to your email"
 *       400:
 *         description: User Not found
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
 *                   example: User not found
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
authRoutes.post("/forget-password", forgetPassword);

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
authRoutes.post("/logout", logout)

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
authRoutes.post("/revalidate", revalidateSessions)