import express from 'express';
import { handleImageUpload } from '../middleware/imageUpload.js';
import {
  getAllRecognitions,
  createRecognition,
  updateRecognition,
  deleteRecognition
} from '../controllers/recognitions.controller.js';

const router = express.Router();

router.get('/', getAllRecognitions);
router.post('/', handleImageUpload('image'), createRecognition);
router.put('/:id', handleImageUpload('image'), updateRecognition);
router.delete('/:id', deleteRecognition);

export default router;
