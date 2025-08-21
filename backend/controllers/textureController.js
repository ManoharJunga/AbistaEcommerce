const Texture = require("../models/textureModel");

// CREATE
exports.createTexture = async (req, res) => {
  try {
    const texture = new Texture(req.body);
    await texture.save();
    res.status(201).json(texture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL
exports.getTextures = async (req, res) => {
  try {
    const textures = await Texture.find();
    res.json(textures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getTextureById = async (req, res) => {
  try {
    const texture = await Texture.findById(req.params.id);
    if (!texture) return res.status(404).json({ error: "Texture not found" });
    res.json(texture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateTexture = async (req, res) => {
  try {
    const texture = await Texture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!texture) return res.status(404).json({ error: "Texture not found" });
    res.json(texture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
exports.deleteTexture = async (req, res) => {
  try {
    const texture = await Texture.findByIdAndDelete(req.params.id);
    if (!texture) return res.status(404).json({ error: "Texture not found" });
    res.json({ message: "Texture deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
