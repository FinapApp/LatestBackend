import express, { Router } from "express";
import { getWalletBalance } from "../../controllers/Wallet/getWalletBalance";

export const walletRoutes: Router = express.Router();

// /**
//  * @swagger
//  * /wallet:
//  *   get:
//  *     summary: Get wallet balance
//  *     tags: [Wallet]
//  *     responses:
//  *       200:
//  *         description: Wallet balance retrieved successfully
//  *       400:
//  *         description: Bad request
//  *       500:
//  *         description: Internal server error
//  */
walletRoutes.get("/wallet", getWalletBalance);