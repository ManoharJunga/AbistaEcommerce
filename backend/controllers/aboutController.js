const About = require("../models/aboutModel.js");

// ✅ Create new About content
const createAbout = async (req, res) => {
  try {
    const about = new About(req.body);
    await about.save();
    res.status(201).json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get about page content (fetch one, since it's usually single-page info)
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About content not found" });
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all About entries (if you allow multiple records)
const getAllAbouts = async (req, res) => {
  try {
    const abouts = await About.find();
    res.json(abouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update About content
const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // if no record, create new
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }
    await about.save();
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete About content
const deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About content not found" });

    await about.deleteOne();
    res.json({ message: "About content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export all functions
module.exports = {
  createAbout,
  getAbout,
  getAllAbouts,
  updateAbout,
  deleteAbout,
};
