
import express, { Router } from "express";
import { updateTheme } from "../../controllers/Setting/Theme/updateTheme";
import { getTheme } from "../../controllers/Setting/Theme/getTheme";


export const settingThemeRoutes: Router = express.Router();


/**
 * @swagger
 * /v1/setting/theme:
 *   get:
 *     summary: Retrieve the current theme settings
 *     tags: [Themes]
 *     responses:
 *       200:
 *         description: Successfully retrieved theme settings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 theme:
 *                   type: string
 *                   example: "light"
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
 *     summary: Update the theme settings
 *     tags: [Themes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: ["light", "dark", "system"]
 *                 example: "dark"
 *     responses:
 *       200:
 *         description: Successfully updated theme settings
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
 *                   example: Theme updated successfully
 *       400:
 *         description: Invalid request body
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
 *                   example: Invalid theme value
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
settingThemeRoutes.route("/setting/theme")
    .put(updateTheme)
    .get(getTheme)