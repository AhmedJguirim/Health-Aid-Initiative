// routes/heartRateRoutes.js

const express = require("express");
const router = express.Router();
const heartRateController = require("../controllers/HeartRate.controller");

// Create a new heart rate entry
//TODO: zid'ha socket
router.post("/heartRates", heartRateController.createHeartRate);

// Get all heart rates for a specific patient
router.get(
  "/patients/:patientID/heartRates",
  heartRateController.getAllHeartRates
);
// Get all heart rates for a specific patient (the real one)
router.get(
  "/doctors/:patient/heartRates",
  heartRateController.doctorGetPatientHeartRate
);

// Get a specific heart rate by ID
router.get("/heartRates/:heartRateId", heartRateController.getHeartRateById);

// Update a heart rate by ID
router.put("/heartRates/:heartRateId", heartRateController.updateHeartRate);

// Delete a heart rate by ID
router.delete("/heartRates/:heartRateId", heartRateController.deleteHeartRate);

module.exports = router;
