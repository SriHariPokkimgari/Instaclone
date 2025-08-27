import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DataBase connectection succefull`);
  } catch (error) {
    console.log(`DataBase connection error : ${error}`);
    process.exit(1);
  }
};

export default connectDB;
