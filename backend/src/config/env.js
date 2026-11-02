import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/mathguruabacus",
  
  // JWT Configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET_KEY || "default_access_secret_key_change_in_prod",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET_KEY || "default_refresh_secret_key_change_in_prod",
  JWT_FRANCHISE_SECRET: process.env.JWT_SECRET_KEY || process.env.JWT_ACCESS_TOKEN_SECRET_KEY || "default_franchise_secret_key_change_in_prod",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Frontend & CORS
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  // Mail / Nodemailer
  FROM_GMAIL: process.env.FROM_GMAIL || "",
  FROM_GMAIL_PASS: process.env.FROM_GMAIL_PASS || process.env.FROM_GAMIL_PASS || "",

  // WhatsApp API
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || "",
  WHATSAPP_API_URL: process.env.WHATSAPP_API_URL || "",
};

export default env;

