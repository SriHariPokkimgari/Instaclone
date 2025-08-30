import User from "../dataBase/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createAccount = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return handleResponse(res, 401, "credentials missing");
    }

    let user = await User.findOne({ email });
    if (user) return handleResponse(res, 401, "user already exists");

    let hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashPassword,
    });

    return handleResponse(res, 201, "Account created successful");
  } catch (error) {
    return handleResponse(res, 400, "something went wrong", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return handleResponse(res, 401, "email or password missing");
    }

    let user = await User.findOne({ email });
    console.log(user);
    if (!user) return handleResponse(res, 404, "email or password incorrect");
    let isPassword = await bcrypt.compare(password, user.password);
    console.log(isPassword);
    if (!isPassword)
      return handleResponse(res, 401, "email or password incorrect");

    user = {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("loginToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      sameSite: "strict",
    });
    handleResponse(res, 200, `Welcome back ${user.username}`, user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const logout = (_, res) => {
  try {
    res.cookie("loginToken", "", { maxAge: 0 });
    handleResponse(res, 202, "Logout successfully");
  } catch (error) {
    console.log(error);
    res.end();
  }
};

export const getProfile = async (req, res) => {
  const username = req.params.username;
  console.log(req.params);
  try {
    if (!username) return handleResponse(res, 400, "username is missing");
    let user = await User.findOne({ username });
    console.log(user);
    if (!user) return handleResponse(res, 404, "user not found");
    user = {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
    return handleResponse(res, 200, "user details fetched successful", user);
  } catch (error) {
    console.log(error);
    res.end();
  }
};
