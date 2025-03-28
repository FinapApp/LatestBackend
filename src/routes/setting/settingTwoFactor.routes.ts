/**
 * @swagger
 * /v1/setting/twoFactor:
 *   put:
 *     summary: Update Two-Factor Authentication settings.
 *     description: Updates the user's two-factor authentication settings. Either `twoFactor` or `twoFactorMethod` must be provided.
 *     tags:
 *       - Settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               twoFactor:
 *                 type: boolean
 *                 description: Enable or disable two-factor authentication.
 *                 example: true
 *               twoFactorMethod:
 *                 type: string
 *                 enum: [sms, email]
 *                 description: The method to use for two-factor authentication.
 *                 example: sms
 *             oneOf:
 *               - required: ["twoFactor"]
 *               - required: ["twoFactorMethod"]
 *     responses:
 *       200:
 *         description: Two-factor authentication settings updated successfully.
 *       400:
 *         description: Invalid input. Either `twoFactor` or `twoFactorMethod` must be provided.
 *       500:
 *         description: Internal server error.
 *   get:
 *     summary: Retrieve Two-Factor Authentication settings.
 *     description: Fetches the current two-factor authentication settings for the user.
 *     tags:
 *       - Settings
 *     responses:
 *       200:
 *         description: Successfully retrieved two-factor authentication settings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 twoFactor:
 *                   type: boolean
 *                   description: Indicates if two-factor authentication is enabled.
 *                   example: true
 *                 twoFactorMethod:
 *                   type: string
 *                   enum: [sms, email]
 *                   description: The method used for two-factor authentication.
 *                   example: sms
 *       500:
 *         description: Internal server error.
 */
import express, { Router } from "express";
import { updateTwoFactorAuth } from "../../controllers/Setting/TwoFactorAuth/updateTwoFactor";
import { getTwoFactorAuth } from "../../controllers/Setting/TwoFactorAuth/getTwoFactorAuth";


export const settingTwoFactorRoutes: Router = express.Router();



settingTwoFactorRoutes.route("/setting/twoFactor")
    .put(updateTwoFactorAuth)
    .get(getTwoFactorAuth)
