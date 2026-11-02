import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import env from "./config/env.js";
import apiRouter from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// ─── Request Logging ─────────────────────────────────────────────────────────
app.use(morgan(env.IS_PRODUCTION ? "combined" : "dev"));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Response Compression ─────────────────────────────────────────────────────
app.use(compression());

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api", apiRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;

