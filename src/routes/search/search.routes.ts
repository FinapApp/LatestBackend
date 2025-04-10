import express, { Router } from "express";
import { searchTest } from "../../controllers/Search/searchTest";



// REDIRECTION TO THE APP STORE IF NOT THIS MAYBE
export const searchRoutes : Router = express.Router();

searchRoutes.get("/search", searchTest)