import express, { Router } from "express";
import { deactivateAccount } from "../controllers/Deativate-Delete/deactivateAccount";
import { deleteAccount } from "../controllers/Deativate-Delete/deleteAccount";


export const deactivationDeleteRoutes: Router = express.Router();


deactivationDeleteRoutes.post("/deactivate-account", deactivateAccount)

deactivationDeleteRoutes.delete("/delete-account", deleteAccount)

