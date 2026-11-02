import * as otpService from "../services/otp.service.js";

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    await otpService.sendOtpToEmail(email);
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Error occurred while sending OTP:", error);
    return res.status(500).json({
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
};

export const validateOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    await otpService.verifyOtpCode(email, otp);
    return res.status(200).json({ success: true, message: "OTP validated successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    console.error("Error occurred while validating OTP:", error);
    return res.status(500).json({ success: false, message: "Failed to validate OTP" });
  }
};

export default {
  sendOTP,
  validateOTP,
};

