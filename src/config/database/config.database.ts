import mongoose from "mongoose";
import { config } from "../generalconfig";

const connectMainDB = async (): Promise<void> => {
  try {
    let dbUri = config.MONGODB.PRODUCTION_URI;
    if (config.NODE_ENV === "development") {
      dbUri = config.MONGODB.DEVELOPMENT_URI;
    }
    await mongoose.connect(dbUri);
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
