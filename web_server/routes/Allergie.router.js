const express = require("express");
const router = express.Router();
const allergieController = require("../controllers/Allergie.controller");

// Create a new allergie
router.post("/allergies", allergieController.createAllergie);

// Get all allergies
router.get("/allergies", allergieController.getAllAllergies);

// Get a specific allergie by name
router.get("/allergies/:name", allergieController.getAllergieByName);

// Update a allergie by name
router.put("/allergies/:name", allergieController.updateAllergie);

router.get("/allergies/search/:partialName", allergieController.partialSearch);

// Delete a allergie by name
router.delete("/allergies/:name", allergieController.deleteAllergie);

module.exports = router;
