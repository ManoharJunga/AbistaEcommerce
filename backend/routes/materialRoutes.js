const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");

// CREATE
router.post("/", materialController.createMaterial);

// READ ALL
router.get("/", materialController.getMaterials);

// READ ONE
router.get("/:id", materialController.getMaterialById);

// UPDATE
router.put("/:id", materialController.updateMaterial);

// DELETE
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;
