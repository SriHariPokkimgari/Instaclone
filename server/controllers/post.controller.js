import Post from "../dataBase/models/post.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import User from "../dataBase/models/user.model.js";
import Comment from "../dataBase/models/comment.model.js";

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
    const image = req.file;
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
        select: ["username", "profilePicture"],
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "auther",
          select: "username",
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
        select: ["username", "profilePicture"],
      })
      .populate({
        path: "comments",
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

export const likePost = async (req, res) => {
  try {
    const autherId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return handleResponse(res, 404, "post not found");
    await post.updateOne({ $addToSet: { likes: autherId } });
    await post.save();

    //implement socket.io for real time notification.
    return handleResponse(res, 200, "post liked");
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};

export const disLikePost = async (req, res) => {
  try {
    const autherId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return handleResponse(res, 404, "post not found");
    await post.updateOne({ $pull: { likes: autherId } });
    await post.save();
    return handleResponse(res, 200, "post disliked");
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};

export const setComment = async (req, res) => {
  try {
    const autherId = req.id;
    const postId = req.params.id;
    const { text } = req.body;
    if (!text) return handleResponse(res, 400, "text required");
    const comment = await Comment.create({
      text,
      auther: autherId,
      post: postId,
    }).populate({
      path: "auther",
      select: "username profilePicture",
    });
    const post = await Post.findById(postId);
    if (post) {
      post.comments.push(comment._id);
      post.save();
    }
    return handleResponse(res, 200, "post commented");
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "somethimg went wrong", error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("auther", "username profilePicture");
    if (!comments) return handleResponse(res, 404, "comments not found");
    return handleResponse(res, 200, "fetched all comments", comments);
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const autherId = req.id;
    const post = await Post.findById(postId);
    if (!post) return handleResponse(res, 404, "post not found");
    //check post belongs to the auther or not.
    if (post.auther.toString() !== autherId)
      return handleResponse(res, 403, "unautherized");

    //delete post.
    await Post.findByIdAndDelete(postId);

    //deleted post reference delete in user schema.
    const user = await User.findById(autherId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    user.save();

    //deleted post comments delete in comments.
    await Comment.deleteMany({ post: postId });

    return handleResponse(res, 200, "post deleted");
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};

export const saveBookMarks = async (req, res) => {
  try {
    const postId = req.params.id;
    const autherId = req.id;

    const post = await Post.findById(postId);
    if (!post) return handleResponse(res, 404, "post not found");

    const user = await User.findById(autherId);

    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "unsave", message: "post removed from bookmarks" });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({ type: "save", message: "post bookmarked" });
    }
  } catch (error) {
    console.log(error);
    return handleResponse(res, 500, "something went wrong", error);
  }
};
