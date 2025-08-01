import Founder from '../models/Founder.js';

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
    const founder = new Founder(req.body);
    const savedFounder = await founder.save();
    res.status(201).json(savedFounder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update founder
export const updateFounder = async (req, res) => {
  try {
    const founder = await Founder.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const founder = await Founder.findByIdAndDelete(req.params.id);
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    res.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
