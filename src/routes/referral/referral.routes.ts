import express, { Router } from "express";
import { getReferredUsers } from "../../controllers/ReferralCode/getReferrals";
import { applyReferralCode } from "../../controllers/ReferralCode/applyReferralCode";



export const referralRoutes: Router = express.Router();


referralRoutes.route("/refer")
        .get(getReferredUsers)
        .post(applyReferralCode)
