import express, { Router } from "express";
import { createBioLink } from "../../controllers/BioLink/createBioLink";
import { updateBioLink } from "../../controllers/BioLink/updateBioLink";
import { deleteBioLink } from "../../controllers/BioLink/deleteBioLink";

export const bioLinkRoutes: Router = express.Router();

bioLinkRoutes.route("/bio-link")
    .post(createBioLink)

bioLinkRoutes.route("/bio-link/:bioLinkId")
    .put(updateBioLink)
    .delete(deleteBioLink)