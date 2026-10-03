import { addBranch, getAllBranches, getBranchByFranshiseId, updateBranch, deleteBranch } from "../controlers/branch.controler.js";
import express from "express";
import { validateInput } from '../middleware/validateInput.js';
import { branchInputValidator } from '../validators/branchInput.validator.js';

const router = express.Router();

router.post("/addbranch", validateInput(branchInputValidator), addBranch);
router.get("/allbranches", getAllBranches);
router.get("/branch/:id", getBranchByFranshiseId);
router.put("/updatebranch/:id", validateInput(branchInputValidator), updateBranch);
router.delete("/deletebranch/:id", deleteBranch);

export default router;
