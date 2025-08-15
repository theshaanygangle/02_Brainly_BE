import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ Database Connected to ${conn.connection.name}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ DB Connection Failed:", error.message);
    } else {
      console.error("❌ DB Connection Failed:", error);
    }
    process.exit(1);
  }
};
