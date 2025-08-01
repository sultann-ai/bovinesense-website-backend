import express from 'express';
import {
  getAllContacts,
  createContact,
  deleteContact
} from '../controllers/contact.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
// Create contact (public form submission)
router.post('/', createContact);

// Protected routes (authentication required)
// Get all contacts (admin only)
router.get('/', verifyToken, getAllContacts);

// Delete contact (admin only)
router.delete('/:id', verifyToken, deleteContact);

export default router;
