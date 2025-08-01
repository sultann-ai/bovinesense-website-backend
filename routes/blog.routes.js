import express from 'express';
import {
  getAllBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blog.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
// Get all blog posts
router.get('/', getAllBlogPosts);

// Get blog post by ID
router.get('/:id', getBlogPostById);

// Get blog post by slug
router.get('/slug/:slug', getBlogPostBySlug);

// Protected routes (authentication required)
// Create blog post
router.post('/', verifyToken, createBlogPost);

// Update blog post
router.put('/:id', verifyToken, updateBlogPost);

// Delete blog post
router.delete('/:id', verifyToken, deleteBlogPost);

export default router;
