const express = require("express");
const router = express.Router();
const textureController = require("../controllers/textureController");

// CREATE
router.post("/", textureController.createTexture);

// READ ALL
router.get("/", textureController.getTextures);

// READ ONE
router.get("/:id", textureController.getTextureById);

// UPDATE
router.put("/:id", textureController.updateTexture);

// DELETE
router.delete("/:id", textureController.deleteTexture);

module.exports = router;
