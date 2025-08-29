import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 4 charactars long"],
    maxlength: [30, "Username must be below 30 characters"],
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "password must be at least 6 characters long"],
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

// userSchema.virtual("followersCount").get(function () {
//   return this.followers.length;
// });

// userSchema.virtual("followingCount").get(function () {
//   return this.following.length;
// });

// userSchema.virtual("postsCount").get(function () {
//   return this.post.length;
// });

// userSchema.set("toJSON", { virtuals: true });

userSchema.pre("save", async function () {
  if (this.isModified(this.password)) {
    await bcrypt.hash(this.password, 10);
  }
});

const User = model("User", userSchema);

export default User;
