import express from "express";
import multer from "multer";

import userRoute from "./user.route.js";
import franchiseRoute from "./franchise.route.js";
import courseRoute from "./courses.route.js";
import otpRoute from "./otp.route.js";
import enrollRoute from "./courseEnrollment.route.js";
import studentAdmissionRoute from "./studentAdmission.route.js";
import branchRoute from "./branch.route.js";
import productRoute from "./products.route.js";
import moduleRoute from "./modules.route.js";

const router = express.Router();

// Multer memory storage configuration for product uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Domain Route Mounts
router.use("/products", upload.array("image", 5), productRoute);
router.use("/users", userRoute);
router.use("/franchises", franchiseRoute);
router.use("/otpValidator", otpRoute);
router.use("/courses", courseRoute);
router.use("/enrollcourse", enrollRoute);
router.use("/admission", studentAdmissionRoute);
router.use("/branches", branchRoute);
router.use("/modules", moduleRoute);

export default router;

