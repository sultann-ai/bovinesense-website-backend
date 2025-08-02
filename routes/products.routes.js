import express from 'express';
import { handleMixedImageUpload, handleMultipleImageUpload } from '../middleware/imageUpload.js';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductScreenshots,
  addProductScreenshots,
  removeProductScreenshot
} from '../controllers/products.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
// Get all products
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get product by slug
router.get('/slug/:slug', getProductBySlug);

// Get product screenshots only (helper for frontend)
router.get('/:id/screenshots', getProductScreenshots);

// Protected routes (authentication required)
// Create product
router.post('/', verifyToken, handleMixedImageUpload(), createProduct);

// Update product
router.put('/:id', verifyToken, handleMixedImageUpload(), updateProduct);

// Add screenshots to existing product
router.post('/:id/screenshots', verifyToken, handleMultipleImageUpload('screenshots', 10), addProductScreenshots);

// Remove specific screenshot by index
router.delete('/:id/screenshots/:index', verifyToken, removeProductScreenshot);

// Delete product
router.delete('/:id', verifyToken, deleteProduct);

export default router;
