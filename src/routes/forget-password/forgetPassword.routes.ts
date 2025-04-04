
import express, { Router } from "express";
import { forgetPassword } from "../../controllers/ForgetPassword/forgetPassword";
import { verifyOTPForgetPassword } from "../../controllers/ForgetPassword/verifyOTPForgetPassword";
import { updatePasswordAfterOTP } from "../../controllers/ForgetPassword/updatePasswordAfterForget";

export const forgetPasswordRoutes: Router = express.Router();
/**
 * @swagger
 * /forget-password:
 *   post:
 *     summary: Forget Password
 *     tags: [Forget Password]
 *     requestBody:
 *       description: >
 *         Provide one of the following identifiers: email, phone number, or username. Only one is required.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'dcode.0n1@gmail.com'
 *               phone:
 *                 type: string  
 *                 example: "1234567890"
 *               username:
 *                 type: string
 *                 example: "dcode"
 *             oneOf:
 *               - required: ["email"]
 *               - required: ["phone"]
 *               - required: ["username"]
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
/**
 * @swagger
 * /forget-password:
 *   put:
 *     summary: Verify OTP and reset password
 *     tags: [Forget Password]
 *     requestBody:
 *       description: >
 *         Provide OTP, new password, and one of the following identifiers: email, phone number, or username. Only one identifier is required.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "dcode.0n1@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               username:
 *                 type: string
 *                 example: "dcode"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *             oneOf:
 *               - required: ["otp", "password", "email"]
 *               - required: ["otp", "password", "phone"]
 *               - required: ["otp", "password", "username"]
 *     responses:
 *       200:
 *         description: Password successfully reset
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
 *                   example: "Password has been reset successfully"
 *       400:
 *         description: Invalid OTP or missing required fields
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
 *                   example: "Invalid OTP or missing required fields"
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

forgetPasswordRoutes.route("/forget-password")
    .post(forgetPassword)
    .put(updatePasswordAfterOTP)


    /**
     * @swagger
     * /forget-password-otp:
     *   post:
     *     summary: Verify OTP
     *     tags: [Forget Password]
     *     requestBody:
     *       description: >
     *         Provide OTP and one of the following identifiers: email, phone number, or username. Only one identifier is required.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               otp:
     *                 type: string
     *                 example: "123456"
     *               email:
     *                 type: string
     *                 example: "dcode.0n1@gmail.com"
     *               phone:
     *                 type: string
     *                 example: "1234567890"
     *               username:
     *                 type: string
     *                 example: "dcode"
     *             oneOf:
     *               - required: ["otp", "email"]
     *               - required: ["otp", "phone"]
     *               - required: ["otp", "username"]
     *     responses:
     *       200:
     *         description: OTP successfully verified
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
     *                   example: "OTP verified successfully"
     *       400:
     *         description: Invalid OTP or missing required fields
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
     *                   example: "Invalid OTP or missing required fields"
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
forgetPasswordRoutes.post("/forget-password-otp" ,verifyOTPForgetPassword)