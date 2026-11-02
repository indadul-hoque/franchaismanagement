import express from "express";
import { sendOTP, validateOTP } from "../controllers/otp.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/otpSend", authLimiter, sendOTP);
router.post("/otpValidate", authLimiter, validateOTP);

export default router;

