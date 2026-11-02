import cloudinary from "cloudinary";
import Product from "../models/products.model.js";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ public_id: result.public_id, url: result.secure_url });
        }
      })
      .end(fileBuffer);
  });
};

export const createProductWithImages = async (productData, files) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "No image uploaded");
  }

  const imageFiles = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer))
  );

  const newProductData = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    stock: productData.stock,
    image: imageFiles,
  };

  return await Product.create(newProductData);
};

export const getAllProducts = async () => {
  return await Product.find();
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const updateProductById = async (id, updateBody, files) => {
  let imageFiles = [];
  if (files && files.length > 0) {
    imageFiles = await Promise.all(
      files.map((file) => uploadBufferToCloudinary(file.buffer))
    );
  }

  const updatedData = {
    ...updateBody,
    ...(imageFiles.length ? { image: imageFiles } : {}),
  };

  const product = await Product.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const deleteProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.image && Array.isArray(product.image)) {
    await Promise.all(
      product.image.map(async (img) => {
        if (img.public_id) {
          try {
            await cloudinary.v2.uploader.destroy(img.public_id);
          } catch (err) {
            console.error("[Cloudinary] Destroy error:", err);
          }
        }
      })
    );
  }

  await product.deleteOne();
  return product;
};

export default {
  uploadBufferToCloudinary,
  createProductWithImages,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};

