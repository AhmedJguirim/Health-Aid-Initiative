// routes/temperatureRoutes.js

const express = require("express");
const router = express.Router();
const temperatureController = require("../controllers/Temperature.controller");

// Create a new heart rate entry
//TODO: zid'ha socket
router.post("/temperatures", temperatureController.createTemperature);

// Get all heart rates for a specific patient
// router.get(
//   "/patients/:patientID/temperatures",
//   temperatureController.getAllTemperatures
// );
// Get all heart rates for a specific patient as a doctor(the real one)
router.get(
  "/doctors/:patient/temperatures",
  temperatureController.doctorGetPatientTemperature
);
// a patient gets his heartrates
router.get(
  "/patients/temperatures",
  temperatureController.patientGetHisTemperatures
);

// Get a specific heart rate by ID
router.get(
  "/temperatures/:temperatureId",
  temperatureController.getTemperatureById
);

// Update a heart rate by ID
router.put(
  "/temperatures/:temperatureId",
  temperatureController.updateTemperature
);

// Delete a heart rate by ID
router.delete(
  "/temperatures/:temperatureId",
  temperatureController.deleteTemperature
);

module.exports = router;
