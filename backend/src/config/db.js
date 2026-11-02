import mongoose from "mongoose";
import env from "./env.js";

const connectDatabase = async (uri = env.MONGODB_URI) => {
  try {
    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: !env.IS_PRODUCTION,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("[Database] Runtime connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[Database] MongoDB disconnected. Attempting reconnection...");
    });

    return conn;
  } catch (error) {
    console.error("[Database] Connection failure:", error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("[Database] MongoDB connection closed.");
  } catch (err) {
    console.error("[Database] Error closing connection:", err);
  }
};

export default connectDatabase;

