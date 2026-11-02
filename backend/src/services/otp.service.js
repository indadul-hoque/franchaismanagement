import OTPModel from "../models/otp.model.js";
import nodemailer from "nodemailer";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const sendOtpToEmail = async (email) => {
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await OTPModel.findOneAndUpdate(
    { email },
    { otp, otpExpiry },
    { upsert: true, new: true, runValidators: true }
  );

  if (env.FROM_GMAIL && env.FROM_GMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: env.FROM_GMAIL,
        pass: env.FROM_GMAIL_PASS,
      },
    });

    const receiver = {
      from: env.FROM_GMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(receiver);
  } else {
    console.warn(`[OTP] Nodemailer credentials not fully configured. Generated OTP for ${email}: ${otp}`);
  }

  return { email, otpExpiry };
};

export const verifyOtpCode = async (email, otp) => {
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const record = await OTPModel.findOne({ email });
  if (!record) {
    throw new ApiError(400, "OTP not found or expired");
  }

  if (new Date() > new Date(record.otpExpiry)) {
    throw new ApiError(400, "OTP has expired. Please request a new one");
  }

  if (String(record.otp) !== String(otp)) {
    throw new ApiError(400, "Invalid OTP");
  }

  await OTPModel.deleteOne({ _id: record._id });
  return true;
};

export default {
  generateOTP,
  sendOtpToEmail,
  verifyOtpCode,
};

