import express from 'express';
import { handleImageUpload } from '../middleware/imageUpload.js';
import {
  getAllFounders,
  getFounderById,
  createFounder,
  updateFounder,
  deleteFounder
} from '../controllers/founders.controller.js';

const router = express.Router();

// Get all founders
router.get('/', getAllFounders);

// Get founder by ID
router.get('/:id', getFounderById);

// Create founder
router.post('/', handleImageUpload('image'), createFounder);

// Update founder
router.put('/:id', handleImageUpload('image'), updateFounder);

// Delete founder
router.delete('/:id', deleteFounder);

export default router;
