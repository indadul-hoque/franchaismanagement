import express from "express";
import {
  franchise_register,
  franchise_login,
  franchise_logout,
  getAll_Franchise,
  franchiseStatusUpdate,
  getAllFranchiseByStatus,
} from "../controllers/franchise.controller.js";
import { validateInput } from "../middlewares/validate.middleware.js";
import { franchiseRegisterInputValidator } from "../validators/franchiseInput.validator.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/franchiseRegister",
  authLimiter,
  validateInput(franchiseRegisterInputValidator),
  franchise_register
);
router.post("/franchiseLogin", authLimiter, franchise_login);
router.get("/franchiseLogout", franchise_logout);
router.get("/getAllFranchises", getAll_Franchise);
router.get("/getAllFranchiseByStatus/:status", getAllFranchiseByStatus);
router.patch("/franchiseStatusUpdate/:id", franchiseStatusUpdate);

export default router;

