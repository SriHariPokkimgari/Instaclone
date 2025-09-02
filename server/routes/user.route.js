import { Router } from "express";

import {
  createAccount,
  editProfile,
  followUsers,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = Router();

router.post("/signup", createAccount);

router.post("/login", login);

router.get("/profile/:username", getProfile);

router.get("/logout", logout);

router.post(
  "/profile/:username/edit",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
);
router.get("/suggested", isAuthenticated, getSuggestedUsers);
router.post("/follow/:username", isAuthenticated, followUsers);
export default router;
