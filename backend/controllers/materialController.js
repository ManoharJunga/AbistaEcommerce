const Material = require("../models/materialModel");

// CREATE
exports.createMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ error: "Material not found" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ error: "Material not found" });
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ error: "Material not found" });
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
