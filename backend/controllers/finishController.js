const Finish = require("../models/finishModel");

// CREATE
exports.createFinish = async (req, res) => {
  try {
    const finish = new Finish(req.body);
    await finish.save();
    res.status(201).json(finish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET ALL
exports.getFinishes = async (req, res) => {
  try {
    const finishes = await Finish.find();
    res.json(finishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getFinishById = async (req, res) => {
  try {
    const finish = await Finish.findById(req.params.id);
    if (!finish) return res.status(404).json({ error: "Finish not found" });
    res.json(finish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateFinish = async (req, res) => {
  try {
    const finish = await Finish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!finish) return res.status(404).json({ error: "Finish not found" });
    res.json(finish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
exports.deleteFinish = async (req, res) => {
  try {
    const finish = await Finish.findByIdAndDelete(req.params.id);
    if (!finish) return res.status(404).json({ error: "Finish not found" });
    res.json({ message: "Finish deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
