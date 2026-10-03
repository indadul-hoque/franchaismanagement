import express from 'express'
import { franchise_register, franchise_login, franchise_logout, getAll_Franchise, franchiseStatusUpdate, getAllFranchiseByStatus } from '../controlers/franchise.controler.js';
import { validateInput } from '../middleware/validateInput.js';
import { franchiseRegisterInputValidator } from '../validators/franchiseInput.validator.js';
const router = express.Router();

router.post("/franchiseRegister", validateInput(franchiseRegisterInputValidator), franchise_register)
router.post("/franchiseLogin", franchise_login)
router.get("/franchiseLogout", franchise_logout)
router.get("/getAllFranchises", getAll_Franchise)
router.get("/getAllFranchiseByStatus/:status", getAllFranchiseByStatus)
router.patch("/franchiseStatusUpdate/:id", franchiseStatusUpdate)

export default router