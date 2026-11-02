import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/singleProduct/:id", getSingleProduct);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;

