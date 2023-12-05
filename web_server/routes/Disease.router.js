const express = require("express");
const router = express.Router();
const diseaseController = require("../controllers/Disease.controller");

// Create a new disease
router.post("/diseases", diseaseController.createDisease);

// Get all diseases
router.get("/diseases", diseaseController.getAllDiseases);

// Get a specific disease by name
router.get("/diseases/:name", diseaseController.getDiseaseByName);

// Update a disease by name
router.put("/diseases/:name", diseaseController.updateDisease);

router.get("/diseases/search/:partialName", diseaseController.partialSearch);

// Delete a disease by name
router.delete("/diseases/:name", diseaseController.deleteDisease);

module.exports = router;
