import express, { Router } from "express";
import { search } from "../../controllers/Search/search";



// REDIRECTION TO THE APP STORE IF NOT THIS MAYBE
export const searchRoutes: Router = express.Router();

searchRoutes.get("/search", search)