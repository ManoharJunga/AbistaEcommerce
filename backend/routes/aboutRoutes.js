const express = require("express");
const {
  createAbout,
  getAbout,
  getAllAbouts,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController.js");

const router = express.Router();

// CRUD routes
router.post("/", createAbout);      // Create
router.get("/", getAbout);          // Get one (latest/about page)
router.get("/all", getAllAbouts);   // Get all (optional)
router.put("/", updateAbout);       // Update
router.delete("/", deleteAbout);    // Delete

module.exports = router;
