import express from 'express';
import { handleImageUpload } from '../middleware/imageUpload.js';
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
router.post('/', handleImageUpload('image'), createTeamMember);

// Update team member
router.put('/:id', handleImageUpload('image'), updateTeamMember);

// Delete team member
router.delete('/:id', deleteTeamMember);

export default router;
