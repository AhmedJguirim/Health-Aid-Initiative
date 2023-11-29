// routes/bloodPressureRoutes.js

const express = require("express");
const router = express.Router();
const bloodPressureController = require("../controllers/BloodPressure.controller");

// Create a new heart rate entry
//TODO: zid'ha socket
router.post("/bloodPressures", bloodPressureController.createBloodPressure);

// Get all heart rates for a specific patient
// router.get(
//   "/patients/:patientID/bloodPressures",
//   bloodPressureController.getAllBloodPressures
// );
// Get all heart rates for a specific patient as a doctor(the real one)
router.get(
  "/doctors/:patient/bloodPressures",
  bloodPressureController.doctorGetPatientBloodPressure
);
// a patient gets his heartrates
router.get(
  "/patients/bloodPressures",
  bloodPressureController.patientGetHisBloodPressures
);

// Get a specific heart rate by ID
router.get(
  "/bloodPressures/:bloodPressureId",
  bloodPressureController.getBloodPressureById
);

// Update a heart rate by ID
router.put(
  "/bloodPressures/:bloodPressureId",
  bloodPressureController.updateBloodPressure
);

// Delete a heart rate by ID
router.delete(
  "/bloodPressures/:bloodPressureId",
  bloodPressureController.deleteBloodPressure
);

module.exports = router;
