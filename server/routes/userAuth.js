import { Router } from "express";
import User from "../dataBase/models/post.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  createAccount,
  getProfile,
  login,
  logout,
} from "../controllers/controller.js";
const router = Router();

router.post("/signup", createAccount);

router.post("/login", login);

router.get("/profile/:username", getProfile);

router.delete("/logout", logout);

export default router;
