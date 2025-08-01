import express from 'express';
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
router.post('/', createPartner);

// Update partner
router.put('/:id', updatePartner);

// Delete partner
router.delete('/:id', deletePartner);

export default router;
