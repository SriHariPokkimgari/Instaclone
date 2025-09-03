import Post from "../dataBase/models/post.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import User from "../dataBase/models/user.model.js";

const handleResponse = (res, status, massage, data = null) => {
  res.status(status).json({
    status: status,
    massage,
    data,
  });
};

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const autherId = req.id;
    const image = res.file;
    if (!image) return handleResponse(res, 400, "image is required");

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 400, height: 400, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      image: cloudResponse.secure_url,
      caption,
      auther: autherId,
    });

    const user = await User.findById(autherId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "auther", select: "-password" });
    return handleResponse(res, 201, "post created", post);
  } catch (error) {
    console.log(error);
    handleResponse(res, 500, "something went wrong", error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "auther",
        select: "username, profilePicture",
      })
      .populate({
        path: "Comments",
        sort: { createdAt: -1 },
        populate: {
          path: "auther",
          select: "username, profilePicture",
        },
      });
    handleResponse(res, 200, "fetched all posts", posts);
  } catch (error) {
    console.log(error);
    handleResponse(res, 500, "something went wrong", error);
  }
};

export const getAutherPost = async (req, res) => {
  try {
    const autherId = req.id;
    const post = await Post.find({ auther: autherId })
      .sort({ createdAt: -1 })
      .populate({
        path: "auther",
        select: "username, profilePicture",
      })
      .populate({
        path: "Comments",
        sort: { createdAt: -1 },
        populate: {
          path: "auther",
          select: "username, profilePicture",
        },
      });
    handleResponse(res, 200, "user post fetched successful", post);
  } catch (error) {
    console.log(error);
    handleResponse(res, 500, "something went wrong", error);
  }
};
