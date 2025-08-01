import TeamMember from '../models/TeamMember.js';

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
    const teamMember = new TeamMember(req.body);
    const savedTeamMember = await teamMember.save();
    res.status(201).json(savedTeamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update team member
export const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
