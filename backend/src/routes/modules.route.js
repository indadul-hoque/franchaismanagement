import express from "express";
import {
  createModules,
  getModulePermission,
} from "../controllers/modules.controller.js";

const router = express.Router();

router.post("/create-modules", createModules);
router.get("/:targetType/:targetId", getModulePermission);

export default router;

