import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';

const router = express.Router();

// Get all services
router.get('/', getAllServices);

// Get service by ID
router.get('/:id', getServiceById);

// Create service
router.post('/', createService);

// Update service
router.put('/:id', updateService);

// Delete service
router.delete('/:id', deleteService);

export default router;
