const Project = require('../models/projectModel'); // Import Project Model
const upload = require('../config/multer'); // Multer for image upload

// Middleware for image upload using the specific multer configuration for project images
exports.uploadProjectImage = upload.uploadProductImage.single('image'); // Use uploadProductImage

// Add a New Project
exports.addProject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required!' });
    }

    // Create a new project
    const project = new Project({
      name: req.body.name,
      title: req.body.title,
      image: req.file.path // Save the uploaded image URL or path
    });

    await project.save();
    res.status(201).json(project); // Return the created project
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
};

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects
    res.status(200).json(projects); // Return projects
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Single Project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found!' });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found!' });
    }
    res.status(200).json({ message: 'Project deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
