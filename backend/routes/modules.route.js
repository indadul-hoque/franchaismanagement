import express from "express";
import {
  createModules,
  getModulePermission,
} from "../controlers/modules.controler.js";

const router = express.Router();

router.post("/create-modules", createModules);
router.get("/:targetType/:targetId", getModulePermission);

export default router;
