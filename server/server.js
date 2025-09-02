import express from "express";
import dotenv from "dotenv";
import connectDB from "./dataBase/connection.js";
import router from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", router);

connectDB();
app.listen(process.env.PORT, () =>
  console.log(`server running on http://localhost:${process.env.PORT}`)
);
