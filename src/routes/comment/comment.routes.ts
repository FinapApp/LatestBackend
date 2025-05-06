import express, { Router } from "express";
import { createComment } from "../../controllers/Comment/createComment";
import { deleteComment } from "../../controllers/Comment/common/deleteComment";
import { getComments } from "../../controllers/Comment/getComments";
import { getChildComments } from "../../controllers/Comment/getChildComments";
import { createReplyComment } from "../../controllers/Comment/Individual/createReplyComment";
import { updateReplyComment } from "../../controllers/Comment/Individual/updateReplyComment";

export const commentRoutes: Router = express.Router();

commentRoutes.route("/comment/:flickId")
    .post(createComment)
    .get(getComments);


commentRoutes.route("/comment/:commentId")
    .delete(deleteComment)
    .put(updateReplyComment)



commentRoutes.route("/comment/:flickId/:commentId")
    .post(createReplyComment)
    .get(getChildComments)

