import rateLimit from "express-rate-limit";

// General API Rate Limiter: 200 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Strict Limiter for sensitive endpoints (Auth, Login, OTP, Registration): 30 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts, please try again after 15 minutes.",
  },
});

export default {
  apiLimiter,
  authLimiter,
};

