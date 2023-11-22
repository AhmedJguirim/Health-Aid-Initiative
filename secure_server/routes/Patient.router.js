// routes/patientRoutes.js

const express = require("express");
const router = express.Router();
const patientController = require("../controllers/Patient.controller");

// Get all patients
router.get("/patients", patientController.getAllPatients);

// Get a specific patient by ID
router.get("/patients/:patientId", patientController.getPatientById);

// Create a new patient
router.post("/patients", patientController.createPatient);

// Update a patient by ID
router.put("/patients/:patientId", patientController.updatePatient);

// Delete a patient by ID
router.delete("/patients/:patientId", patientController.deletePatient);

// Create a new card for a specific patient
router.post(
  "/patients/:patientID/cards",
  patientController.createCardForPatient
);
// Check if provided code and pinCode match a valid card
router.post("/patients/checkCardValidity", patientController.checkCardValidity);

module.exports = router;
