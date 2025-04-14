import express, { Router } from "express";
import { getWalletBalance } from "../../controllers/Wallet/getWalletBalance";

export const walletRoutes: Router = express.Router();


walletRoutes.get("/wallet", getWalletBalance);