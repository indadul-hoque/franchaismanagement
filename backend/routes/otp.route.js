import { sendOTP } from "../controlers/otp.controler.js";
import express, { Router } from 'express'

const router = express.Router();

router.post("/otpSend", sendOTP)

export default router;