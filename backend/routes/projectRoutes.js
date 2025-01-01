const express = require('express');
const router = express.Router();
const {
  addProject,
  getProjects,
  getProjectById,
  deleteProject,
  uploadProjectImage
} = require('../controllers/projectController');

// Routes for projects
router.post('/', uploadProjectImage, addProject); // Add new project
router.get('/', getProjects); // Get all projects
router.get('/:id', getProjectById); // Get single project by ID
router.delete('/:id', deleteProject); // Delete project by ID

module.exports = router;
