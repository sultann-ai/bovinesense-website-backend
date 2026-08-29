import Partner from '../models/Partner.js';
import { deleteFromCloudinary } from '../middleware/imageUpload.js';

// Get all partners
export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create partner
export const createPartner = async (req, res) => {
  try {
    const partnerData = { ...req.body };
    
    // If logo was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      partnerData.logo = req.cloudinaryResult.url;
    }
    
    const partner = new Partner(partnerData);
    const savedPartner = await partner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update partner
export const updatePartner = async (req, res) => {
  try {
    const partnerData = { ...req.body };
    
    // If logo was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      partnerData.logo = req.cloudinaryResult.url;
    }
    
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      partnerData,
      { new: true, runValidators: true }
    );
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete partner
export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    // If partner has a logo, extract public ID and delete from Cloudinary
    if (partner.logo) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = partner.logo.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `bovinesense/${publicIdWithExt.split('.')[0]}`;
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting logo from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
