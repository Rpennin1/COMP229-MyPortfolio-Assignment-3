
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the MyPortfolio root folder
const envResult = dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

if (envResult.error) {
  console.error("Could not load .env:", envResult.error.message);
}

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI was not found in .env");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("Connected host:", mongoose.connection.host);
    console.log("Database name:", mongoose.connection.name);
    console.log("MongoDB connected successfully!");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default connectDB;
