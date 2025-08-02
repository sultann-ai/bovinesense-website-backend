import express from 'express';
import { handleImageUpload } from '../middleware/imageUpload.js';
import {
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partners.controller.js';

const router = express.Router();

// Get all partners
router.get('/', getAllPartners);

// Create partner
router.post('/', handleImageUpload('image'), createPartner);

// Update partner
router.put('/:id', handleImageUpload('image'), updatePartner);

// Delete partner
router.delete('/:id', deletePartner);

export default router;
