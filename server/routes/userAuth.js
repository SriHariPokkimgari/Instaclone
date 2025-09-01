import { Router } from "express";
import User from "../dataBase/models/post.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  createAccount,
  getProfile,
  login,
  logout,
  updateProfile,
} from "../controllers/controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/signup", createAccount);

router.post("/login", login);

router.get("/profile/:username", getProfile);

router.delete("/logout", logout);

router.put("/update/:username", isAuthenticated, updateProfile);
export default router;
