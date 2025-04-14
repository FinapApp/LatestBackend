
import express, { Router } from "express";
import { getFriendSuggestion } from "../../controllers/FriendsSuggestion/getFriendSuggestion";


export const friendSuggestionRoutes: Router = express.Router();


friendSuggestionRoutes.route("/friend-suggestion")
    .get(getFriendSuggestion);
