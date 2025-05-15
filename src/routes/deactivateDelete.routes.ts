import express, { Router } from "express";
import { deactivateAccount } from "../controllers/Deativate-Delete/deactivateAccount";


export const deactivationDeleteRoutes: Router = express.Router();


deactivationDeleteRoutes.post("/deactivate-account", deactivateAccount)

deactivationDeleteRoutes.delete("/delete-account", deactivateAccount)

