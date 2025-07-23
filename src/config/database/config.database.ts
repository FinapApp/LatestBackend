import mongoose from "mongoose";
import { config } from "../generalconfig";

const connectMainDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URI as string);
    console.log("Main MongoDB connected successfully.");
  } catch (err) {
    console.error("Failed to connect to main MongoDB", err);
    throw err;
  }
};


const connectDB = async (): Promise<void> => {
  try {
    await connectMainDB();
  } catch (err) {
    console.error("Error in database connection", err);
    process.exit(1);
  }
};

export { connectDB };
