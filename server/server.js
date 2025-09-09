import express from "express";
import dotenv from "dotenv";
import connectDB from "./dataBase/connection.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/message.route.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("api/comment", commentRouter);

connectDB();
app.listen(process.env.PORT, () =>
  console.log(`server running on http://localhost:${process.env.PORT}`)
);
