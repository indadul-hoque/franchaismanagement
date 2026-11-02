import express from "express";
import {
  addBranch,
  getAllBranches,
  getBranchByFranshiseId,
  updateBranch,
  deleteBranch,
} from "../controllers/branch.controller.js";
import { validateInput } from "../middlewares/validate.middleware.js";
import { branchInputValidator } from "../validators/branchInput.validator.js";

const router = express.Router();

router.post("/addbranch", validateInput(branchInputValidator), addBranch);
router.get("/allbranches", getAllBranches);
router.get("/branch/:id", getBranchByFranshiseId);
router.put("/updatebranch/:id", validateInput(branchInputValidator), updateBranch);
router.delete("/deletebranch/:id", deleteBranch);

export default router;

