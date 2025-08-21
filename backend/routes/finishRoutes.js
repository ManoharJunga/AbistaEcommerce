// routes/finishRoutes.js
const express = require("express");
const router = express.Router();
const finishController = require("../controllers/finishController");

router.post("/", finishController.createFinish);
router.get("/", finishController.getFinishes);
router.get("/:id", finishController.getFinishById);
router.put("/:id", finishController.updateFinish);
router.delete("/:id", finishController.deleteFinish);

module.exports = router;
