import express, { Router } from "express";
import { search } from "../../controllers/Search/search";
import { createUserSearchHistory } from "../../controllers/Search/History/createUserSearchHistory";
import { getUserSearchHistory } from "../../controllers/Search/History/getUserSearchHistory";
import { deleteUserSearchHistory } from "../../controllers/Search/History/deleteUserSearchHistory";



// REDIRECTION TO THE APP STORE IF NOT THIS MAYBE
export const searchRoutes: Router = express.Router();

searchRoutes.get("/search", search)



// SEARCH HISTORY
searchRoutes.route("/search-history")
    .post(createUserSearchHistory)
    .get(getUserSearchHistory)
    
searchRoutes.delete("/search-history/:searchId", deleteUserSearchHistory)