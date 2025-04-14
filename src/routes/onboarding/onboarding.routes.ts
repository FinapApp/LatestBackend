import express, { Router } from "express";
import { signUp } from "../../controllers/Onboarding/signUp";
import { verifyOTPAfterSignUp } from "../../controllers/Onboarding/verifyOTP";
export const onboardingRoutes: Router = express.Router();



onboardingRoutes.post("/sign-up", signUp);

onboardingRoutes.post("/verify-otp", verifyOTPAfterSignUp);

