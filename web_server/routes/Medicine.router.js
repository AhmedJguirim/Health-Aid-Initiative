const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/Medicine.controller");

// Create a new medicine
router.post("/medicines", medicineController.createMedicine);

// Get all medicines
router.get("/medicines", medicineController.getAllMedicines);

// Get a specific medicine by name
router.get("/medicines/:name", medicineController.getMedicineByName);

// Update a medicine by name
router.put("/medicines/:name", medicineController.updateMedicine);

router.get("/medicines/search/:partialName", medicineController.partialSearch);

// Delete a medicine by name
router.delete("/medicines/:name", medicineController.deleteMedicine);

module.exports = router;
