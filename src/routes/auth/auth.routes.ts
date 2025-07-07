import express, { Router } from "express";
import { login } from "../../controllers/Auth/login";
// import { logout } from "../../controllers/Auth/logout";
import { revalidateSessions } from "../../controllers/Auth/revalidateSessions";
import { twoFactorAuthentication } from "../../controllers/Auth/twoFactorAuthentication";

export const authRoutes: Router = express.Router();

authRoutes.post("/login", login);
// authRoutes.post("/logout", logout)
authRoutes.post("/revalidate", revalidateSessions)
authRoutes.post("/login/two-factor-auth", twoFactorAuthentication);


