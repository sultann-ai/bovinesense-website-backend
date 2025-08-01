import Partner from '../models/Partner.js';

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
    const partner = new Partner(req.body);
    const savedPartner = await partner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update partner
export const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
