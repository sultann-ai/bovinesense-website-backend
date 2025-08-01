import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projects.controller.js';

const router = express.Router();

// Get all projects
router.get('/', getAllProjects);

// Get project by ID
router.get('/:id', getProjectById);

// Create project
router.post('/', createProject);

// Update project
router.put('/:id', updateProject);

// Delete project
router.delete('/:id', deleteProject);

export default router;
