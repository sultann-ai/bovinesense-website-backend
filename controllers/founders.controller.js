import Founder from '../models/Founder.js';
import { deleteFromCloudinary } from '../middleware/imageUpload.js';

// Get all founders
export const getAllFounders = async (req, res) => {
  try {
    const founders = await Founder.find().sort({ createdAt: -1 });
    res.json(founders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get founder by ID
export const getFounderById = async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id);
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    res.json(founder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create founder
export const createFounder = async (req, res) => {
  try {
    const founderData = { ...req.body };
    
    // If image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      founderData.image = req.cloudinaryResult.url;
    }
    
    const founder = new Founder(founderData);
    const savedFounder = await founder.save();
    res.status(201).json(savedFounder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update founder
export const updateFounder = async (req, res) => {
  try {
    const founderData = { ...req.body };
    
    // If image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      founderData.image = req.cloudinaryResult.url;
    }
    
    const founder = await Founder.findByIdAndUpdate(
      req.params.id,
      founderData,
      { new: true, runValidators: true }
    );
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    res.json(founder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete founder
export const deleteFounder = async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id);
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    
    // If founder has an image, extract public ID and delete from Cloudinary
    if (founder.image) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = founder.image.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `bovinesense/${publicIdWithExt.split('.')[0]}`;
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    await Founder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
