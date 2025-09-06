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
import upload from "../middlewares/multer.js";

const router = Router();

router.post("/newpost", isAuthenticated, upload.single("image"), addNewPost);
router.get("/all", getAllPost);
router.get("/userpost/all", isAuthenticated, getAutherPost);
router.post("/:id/like", isAuthenticated, likePost);
router.post("/:id/dislike", isAuthenticated, disLikePost);
router.post("/:id/comment", isAuthenticated, setComment);
router.get("/:id/comment/all", getCommentsOfPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.get("/:id/bookmark", isAuthenticated, saveBookMarks);

export default router;
