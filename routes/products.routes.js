import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
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

// Protected routes (authentication required)
// Create product
router.post('/', verifyToken, createProduct);

// Update product
router.put('/:id', verifyToken, updateProduct);

// Delete product
router.delete('/:id', verifyToken, deleteProduct);

export default router;
