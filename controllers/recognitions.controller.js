import Recognition from '../models/Recognition.js';
import { deleteFromCloudinary } from '../middleware/imageUpload.js';

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

  const urlParts = imageUrl.split('/');
  const publicIdWithExt = urlParts[urlParts.length - 1];
  const publicId = `bovinesense/${publicIdWithExt.split('.')[0]}`;
  await deleteFromCloudinary(publicId);
};

export const getAllRecognitions = async (req, res) => {
  try {
    const recognitions = await Recognition.find().sort({ createdAt: -1 });
    res.json(recognitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRecognition = async (req, res) => {
  try {
    const recognitionData = { ...req.body };
    if (req.cloudinaryResult) recognitionData.image = req.cloudinaryResult.url;

    const recognition = await Recognition.create(recognitionData);
    res.status(201).json(recognition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRecognition = async (req, res) => {
  try {
    const existingRecognition = await Recognition.findById(req.params.id);
    if (!existingRecognition) {
      return res.status(404).json({ message: 'Recognition not found' });
    }

    const recognitionData = { ...req.body };
    if (req.cloudinaryResult) {
      recognitionData.image = req.cloudinaryResult.url;
      await deleteCloudinaryImage(existingRecognition.image).catch((error) => {
        console.error('Error deleting old recognition logo:', error);
      });
    }

    const recognition = await Recognition.findByIdAndUpdate(
      req.params.id,
      recognitionData,
      { new: true, runValidators: true }
    );
    res.json(recognition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecognition = async (req, res) => {
  try {
    const recognition = await Recognition.findById(req.params.id);
    if (!recognition) {
      return res.status(404).json({ message: 'Recognition not found' });
    }

    await deleteCloudinaryImage(recognition.image).catch((error) => {
      console.error('Error deleting recognition logo:', error);
    });
    await Recognition.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recognition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

