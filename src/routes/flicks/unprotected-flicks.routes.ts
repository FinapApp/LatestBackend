import express, { Router } from "express";
import { getFlick } from "../../controllers/Flicks/getFlick";


export const flickRoutes: Router = express.Router();

/**
 * @swagger
 * /flick/{flickId}:
 *   get:
 *     summary: Get a single flick by ID
 *     tags:
 *       - Unprotected Flicks
 *     description: Retrieve a single flick by its ID.
 *     parameters:
 *       - in: path
 *         name: flickId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flick to retrieve
 *     responses:
 *       200:
 *         description: A single flick
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 releaseDate:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Flick not found
 */
flickRoutes.get("/flick/:flickId", getFlick)
