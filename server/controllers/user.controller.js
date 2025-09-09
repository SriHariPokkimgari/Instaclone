import User from "../dataBase/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../dataBase/models/post.model.js";
dotenv.config();
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createAccount = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return handleResponse(res, 401, "credentials missing");
    }

    let user = await User.findOne({ email });
    if (user) return handleResponse(res, 400, "user already exists");

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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return handleResponse(res, 401, "email or password missing");
    }

    let user = await User.findOne({ email });
    if (!user) return handleResponse(res, 404, "email or password incorrect");
    let isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return handleResponse(res, 401, "email or password incorrect");

    const populated = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.auther.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    user = {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populated,
      bookmarks: user.bookmarks,
    };
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    handleResponse(res, 200, `Welcome back ${user.username}`, user);
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};

export const logout = (_, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    handleResponse(res, 202, "Logout successfully");
  } catch (error) {
    return handleResponse(res, 500, "something went wrong");
  }
};

export const getProfile = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) return handleResponse(res, 400, "username is missing");
    let user = await User.findOne({ username }).select("-password");
    if (!user) return handleResponse(res, 404, "user not found");
    return handleResponse(res, 200, "user details fetched successful", user);
  } catch (error) {
    return handleResponse(res, 500, "something went wrong");
  }
};

export const editProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const userId = req.id;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      console.log(1);
      const fileUri = getDataUri(profilePicture);
      console.log(2);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
      console.log(3);
    }
    const user = await User.findById(userId);
    if (!user) return handleResponse(res, 404, "user not found");
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return handleResponse(res, 202, "edit profile successful");
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers)
      return handleResponse(res, 200, "currently no suggested users");
    return handleResponse(
      res,
      200,
      "suggested users fetched successully",
      suggestedUsers
    );
  } catch (error) {
    console.log(error);
    res.end();
  }
};

export const followUsers = async (req, res) => {
  try {
    const userId = req.id;
    const targetUsername = req.params.username;
    const user = await User.findById(userId);
    const targetUser = await User.findOne({ username: targetUsername });
    if (!user || !targetUser) {
      return handleResponse(res, 404, "user not found");
    }

    if (user._id.toString() === targetUser._id.toString())
      return handleResponse(res, 400, "You do not follow youself");

    const following = user.following.includes(targetUser._id);

    if (following) {
      await Promise.all([
        User.updateOne(
          { _id: user._id },
          { $pull: { following: targetUser._id } }
        ),
        User.updateOne(
          { _id: targetUser._id },
          { $pull: { followers: user._id } }
        ),
      ]);
      return handleResponse(res, 200, "unfollow successful");
    } else {
      await Promise.all([
        User.updateOne(
          { _id: user._id },
          { $push: { following: targetUser._id } }
        ),
        User.updateOne(
          { _id: targetUser._id },
          { $push: { followers: user._id } }
        ),
      ]);
      return handleResponse(res, 200, "follow successful");
    }
  } catch (error) {
    console.log(error);
    res.end();
  }
};
