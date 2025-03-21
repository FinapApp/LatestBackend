import express, { Router } from "express";
import { signUp } from "../../controllers/Onboarding/signUp";
import { verifyOTPAfterSignUp } from "../../controllers/Onboarding/verifyOTP";
import { checkUserNameExist } from "../../controllers/Onboarding/checkUsernameExist";
import { checkEmailExist } from "../../controllers/Onboarding/checkEmailExist";

export const onboardingRoutes: Router = express.Router();



/**
 * @swagger
 * /check-username:
 *   post:
 *     summary: Check if a username exists
 *     tags: 
 *       - Onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *             example:
 *               username: "user123"
 *     responses:
 *       200:
 *         description: Username availability check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Username is available"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Username is required"
 *       409:
 *         description: Conflict - Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Username already exists"
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
onboardingRoutes.post("/check-username", checkUserNameExist);


/**
 * @swagger
 * /check-email:
 *   post:
 *     summary: Check if an email exists
 *     tags: 
 *       - Onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Email availability check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Email is available"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Email is required"
 *       409:
 *         description: Conflict - Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Email already exists"
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
onboardingRoutes.post("/check-email", checkEmailExist);
/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: Sign up a new user
 *     tags: 
 *       - Onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                type: string
 *             example:
 *               email: "dcode.0n1@gmail.com"
 *               name: "John Doe"
 *     responses:
 *       200:
 *         description: User wanted to sign-up and verify it by providing an OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "OTP sent successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               InvalidEmail:
 *                 value:
 *                   success: false
 *                   message: "\"email\" must be a valid email"
 *               InvalidName:
 *                 value:
 *                   success: false
 *                   message: "\"name\" is required"
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
onboardingRoutes.post("/sign-up", signUp);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP after sign up
 *     tags: 
 *       - Onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               fcmToken:
 *                 type: string
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *               country:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               otp: "GHhBJB"
 *               fcmToken: "asd"
 *               email: "ck8824deb@gmail.com"
 *               username: "Jarvis0013"
 *               name: "Chirag Khandelwal"
 *               dob: "28-05-1997"
 *               country: "IN"
 *               password: "jalwa"
 *     responses:
 *       200:
 *         description: OTP verified successfully and account created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Account created successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               OTPExpired:
 *                 value:
 *                   success: false
 *                   message: "OTP expired"
 *               OTPNotMatch:
 *                 value:
 *                   success: false
 *                   message: "OTP does not match"
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
onboardingRoutes.post("/verify-otp", verifyOTPAfterSignUp);

