import express, { Router } from "express";
import { login } from "../../controllers/Auth/login";
import { logout } from "../../controllers/Auth/logout";
import { revalidateSessions } from "../../controllers/Auth/revalidateSessions";
import { twoFactorAuthentication } from "../../controllers/Auth/twoFactorAuthentication";
import { isAuthenticatedUser } from "../../middlewares/isAuthenticatedUser";

export const authRoutes: Router = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", isAuthenticatedUser, logout)
authRoutes.post("/revalidate", isAuthenticatedUser, revalidateSessions)
authRoutes.post("/login/two-factor-auth", isAuthenticatedUser, twoFactorAuthentication);



