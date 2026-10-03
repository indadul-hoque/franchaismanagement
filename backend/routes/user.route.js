import express from "express";
import {
  login,
  logout,
  register,
  allUsers,
  deleteUser,
  getProfile,
  generateNewAccessToken,
} from "../controlers/users.controler.js";
import { sendWhatsappMessage } from "../controlers/bookFreeClass.js";
import { isAuthenticated } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.delete("/delete/:id", deleteUser);
router.get("/all-users", allUsers);
router.get("/sendWhatsappMessage", sendWhatsappMessage);
router.get("/profile", isAuthenticated, getProfile);
router.post("/generate-new-access-token", generateNewAccessToken);

export default router;
