// routes/spo2Routes.js

const express = require("express");
const router = express.Router();
const spo2Controller = require("../controllers/Spo2.controller");

// Create a new heart rate entry
//TODO: zid'ha socket
router.post("/spo2s", spo2Controller.createSpo2);

// Get all heart rates for a specific patient
// router.get(
//   "/patients/:patientID/spo2s",
//   spo2Controller.getAllSpo2s
// );
// Get all heart rates for a specific patient as a doctor(the real one)
router.get("/doctors/:patient/spo2s", spo2Controller.doctorGetPatientSpo2);
// a patient gets his heartrates
router.get("/patients/spo2s", spo2Controller.patientGetHisSpo2s);

// Get a specific heart rate by ID
router.get("/spo2s/:spo2Id", spo2Controller.getSpo2ById);

// Update a heart rate by ID
router.put("/spo2s/:spo2Id", spo2Controller.updateSpo2);

// Delete a heart rate by ID
router.delete("/spo2s/:spo2Id", spo2Controller.deleteSpo2);

module.exports = router;
