import OTPModel from "../models/otp.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Helper function to generate a 6-digit OTP
        const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        // Save OTP and its expiry to the database (upsert: true to insert/update)
        await OTPModel.findOneAndUpdate(
            { email },
            { otp, otpExpiry },
            { upsert: true, new: true, runValidators: true }
        );

        // Configure nodemailer transporter
        const otpTransporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465, 
            auth: {
                user: process.env.FROM_GMAIL, // Email address from environment variables
                pass: process.env.FROM_GAMIL_PASS, // App password or email password
            },
        });

        // Define email options
        const receiver = {
            from: process.env.FROM_GMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        };

        // Send the email with the OTP
        await otpTransporter.sendMail(receiver);

        res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error occurred while sending OTP:", error);

        // Provide detailed error feedback
        res.status(500).json({
            message: "Failed to send OTP.",
            error: error.message,
        });
    }
};


export const validateOTP = async(req, res) => {
    
}