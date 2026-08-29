import TeamMember from '../models/TeamMember.js';
import { deleteFromCloudinary } from '../middleware/imageUpload.js';

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create team member
export const createTeamMember = async (req, res) => {
  try {
    const teamMemberData = { ...req.body };
    
    // If image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      teamMemberData.image = req.cloudinaryResult.url;
    }
    
    const teamMember = new TeamMember(teamMemberData);
    const savedTeamMember = await teamMember.save();
    res.status(201).json(savedTeamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update team member
export const updateTeamMember = async (req, res) => {
  try {
    const teamMemberData = { ...req.body };
    
    // If image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      teamMemberData.image = req.cloudinaryResult.url;
    }
    
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      teamMemberData,
      { new: true, runValidators: true }
    );
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete team member
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    // If team member has an image, extract public ID and delete from Cloudinary
    if (teamMember.image) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = teamMember.image.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `bovinesense/${publicIdWithExt.split('.')[0]}`;
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
