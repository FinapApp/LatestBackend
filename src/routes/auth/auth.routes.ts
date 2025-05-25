import express, { Router } from "express";
import { login } from "../../controllers/Auth/login";
import { logout } from "../../controllers/Auth/logout";
import { revalidateSessions } from "../../controllers/Auth/revalidateSessions";

export const authRoutes: Router = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout)
authRoutes.post("/revalidate", revalidateSessions)


