import express, { Router } from "express";
import { createFeatureIssue } from "../../controllers/FeatureIssues/createFeatureIssue";


export const featureIssue : Router = express.Router();

featureIssue.post("/feature-issue", createFeatureIssue);
