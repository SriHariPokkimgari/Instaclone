import { Router } from "express";
import User from "../dataBase/model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashPassword,
    });
    res
      .status(201)
      .json({ status: 201, massage: "Account created succesfully" });
  } catch (error) {
    if (error?.errmsg) {
      return res
        .status(400)
        .json({ status: 400, message: "username or email already exists" });
    }
    res.status(500).json({ status: 500, message: `${error}` });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: 400, message: "Incorrect credentials" });
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return res
        .status(400)
        .json({ status: 400, message: "Incorrect credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("user_token", token, { httpOnly });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
