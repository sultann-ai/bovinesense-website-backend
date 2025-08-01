import express from 'express';
import { 
  adminLogin, 
  getAdminProfile, 
  changePassword, 
  adminLogout 
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes (require authentication)
router.use(verifyToken); // Apply authentication middleware to all routes below

router.get('/profile', getAdminProfile);
router.post('/logout', adminLogout);
router.put('/change-password', changePassword);

export default router;
