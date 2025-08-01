import express from 'express';
import { upload, uploadImage } from '../controllers/upload.controller.js';

const router = express.Router();

// Upload image to Cloudinary
router.post('/image', upload.single('image'), uploadImage);

export default router;
