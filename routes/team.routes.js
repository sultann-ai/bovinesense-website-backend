import express from 'express';
import {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/team.controller.js';

const router = express.Router();

// Get all team members
router.get('/', getAllTeamMembers);

// Get team member by ID
router.get('/:id', getTeamMemberById);

// Create team member
router.post('/', createTeamMember);

// Update team member
router.put('/:id', updateTeamMember);

// Delete team member
router.delete('/:id', deleteTeamMember);

export default router;
