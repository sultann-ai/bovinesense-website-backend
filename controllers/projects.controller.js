import Project from '../models/Project.js';
import { deleteFromCloudinary } from '../middleware/imageUpload.js';

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create project
export const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    // If image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      projectData.image = req.cloudinaryResult.url;
    }
    
    const project = new Project(projectData);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    // If image was uploaded, add the Cloudinary URL to the data
    if (req.cloudinaryResult) {
      projectData.image = req.cloudinaryResult.url;
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // If project has an image, extract public ID and delete from Cloudinary
    if (project.image) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = project.image.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `bovinesense/${publicIdWithExt.split('.')[0]}`;
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
