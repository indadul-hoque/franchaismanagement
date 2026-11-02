import * as productService from "../services/product.service.js";

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProductWithImages(req.body, req.files);
    return res.status(201).json({ success: true, product });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return res.status(200).json({ success: true, product });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProductById(req.params.id, req.body, req.files);
    return res.status(200).json({ success: true, product });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProductById(req.params.id);
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

