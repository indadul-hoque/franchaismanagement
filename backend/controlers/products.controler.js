import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Product from '../models/products.model.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new product with image upload to Cloudinary
export const createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const imageFiles = await Promise.all(
            req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    cloudinary.v2.uploader.upload_stream(
                        { resource_type: 'image' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({ public_id: result.public_id, url: result.secure_url });
                            }
                        }
                    ).end(file.buffer);
                });
            })
        );

        const productData = { 
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            image: imageFiles // Store uploaded images in database
        };

        const product = await Product.create(productData);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single product by ID
export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update product by ID with image upload to Cloudinary
export const updateProduct = async (req, res) => {
    try {
        let imageFiles = [];
        if (req.files && req.files.length > 0) {
            imageFiles = await Promise.all(
                req.files.map(async (file) => {
                    const result = cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) throw error;
                        return { public_id: result.public_id, url: result.secure_url };
                    }).end(file.buffer);
                    return result;
                })
            );
        }

        const updatedData = { ...req.body, image: imageFiles.length ? imageFiles : undefined };
        const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete images from Cloudinary
        await Promise.all(
            product.image.map(async (img) => {
                await cloudinary.v2.uploader.destroy(img.public_id);
            })
        );

        await product.deleteOne();
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


