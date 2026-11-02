import express from "express";
import {
  login,
  logout,
  register,
  allUsers,
  deleteUser,
  getProfile,
  generateNewAccessToken,
} from "../controllers/user.controller.js";
import { sendWhatsappMessage } from "../controllers/bookFreeClass.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/logout", isAuthenticated, logout);
router.delete("/delete/:id", isAuthenticated, deleteUser);
router.get("/all-users", isAuthenticated, allUsers);
router.get("/sendWhatsappMessage", sendWhatsappMessage);
router.get("/profile", isAuthenticated, getProfile);
router.post("/generate-new-access-token", generateNewAccessToken);

export default router;

