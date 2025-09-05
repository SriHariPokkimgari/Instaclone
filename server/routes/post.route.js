import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  addNewPost,
  deletePost,
  disLikePost,
  getAllPost,
  getAutherPost,
  getCommentsOfPost,
  likePost,
  saveBookMarks,
  setComment,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post("/newpost", isAuthenticated, addNewPost);
postRouter.get("/posts", getAllPost);
postRouter.get("/userposts", isAuthenticated, getAutherPost);
postRouter.post("/like/:id", isAuthenticated, likePost);
postRouter.post("/dislike", isAuthenticated, disLikePost);
postRouter.post("/:id", isAuthenticated, setComment);
postRouter.get("/:id", getCommentsOfPost);
postRouter.delete("/:id", isAuthenticated, deletePost);
postRouter.put("/:id", isAuthenticated, saveBookMarks);

export default postRouter;
