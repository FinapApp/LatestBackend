import express, { Router } from "express";
import { signUp } from "../../controllers/Onboarding/signUp";
import { verifyOTPAfterSignUp } from "../../controllers/Onboarding/verifyOTP";

export const onboardingRoutes: Router = express.Router();




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
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 *       400:
 *         description: Bad request
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
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad request
 */
onboardingRoutes.post("/verify-otp", verifyOTPAfterSignUp);