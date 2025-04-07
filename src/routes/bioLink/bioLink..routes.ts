
import express, { Router } from "express";
import { createBioLink } from "../../controllers/BioLink/createBioLink";
import { updateBioLink } from "../../controllers/BioLink/updateBioLink";
import { deleteBioLink } from "../../controllers/BioLink/deleteBioLink";


export const bioLinkRoutes: Router = express.Router();

/**
 * @swagger
 * /v1/bio-link:
 *   post:
 *     summary: Create a new bio link
 *     tags: [BioLink]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the bio link
 *                 example: My Portfolio
 *               url:
 *                 type: string
 *                 description: The URL of the bio link
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Bio link created successfully
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
 *                   example: "Bio link created successfully"
 *       400:
 *         description: Validation error
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
 *                   example: "Validation error"
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
 * /v1/bio-link/{bioLinkId}:
 *   put:
 *     summary: Update an existing bio link
 *     tags: [BioLink]
 *     parameters:
 *       - in: path
 *         name: bioLinkId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the bio link to update
 *           example: 64b7f9e2e4b0f5a1c2d3e4f5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the bio link
 *                 example: Updated Portfolio
 *               url:
 *                 type: string
 *                 description: The updated URL of the bio link
 *                 example: https://updated-example.com
 *     responses:
 *       200:
 *         description: Bio link updated successfully
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
 *                   example: "Bio link updated successfully"
 *       400:
 *         description: Validation error
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
 *                   example: "Validation error"
 *       404:
 *         description: Bio link not found
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
 *                   example: "Bio link not found"
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
 *   delete:
 *     summary: Delete an existing bio link
 *     tags: [BioLink]
 *     parameters:
 *       - in: path
 *         name: bioLinkId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the bio link to delete
 *           example: 64b7f9e2e4b0f5a1c2d3e4f5
 *     responses:
 *       200:
 *         description: Bio link deleted successfully
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
 *                   example: "Bio link deleted successfully"
 *       404:
 *         description: Bio link not found
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
 *                   example: "Bio link not found"
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
bioLinkRoutes.route("/bio-link")
    .post(createBioLink)


    bioLinkRoutes.route("/bio-link/:bioLinkId")
    .put(updateBioLink)
    .delete(deleteBioLink)