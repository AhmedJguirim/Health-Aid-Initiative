// routes/patientRoutes.js

const express = require("express");
const router = express.Router();
const patientController = require("../controllers/Patient.controller");
const jwtMiddleware = require("../middleware/jwtMiddleware");

// Create a new patient
router.post("/patients", patientController.createPatient);
router.post("/patientsEnc", patientController.createPatientEnc);
router.post("/addresses", patientController.addAddressToPatient);

// Check if provided code and pinCode match a valid card
router.post("/patients/checkCardValidity", patientController.checkCardValidity);

// Routes that require JWT authentication
// router.use(jwtMiddleware.verifyAccessToken);

// Get all patients
router.get("/patients", patientController.getAllPatients);
router.get("/patients/search", patientController.searchPatientByName);

// Get a specific patient by code
router.get("/patients/:code", patientController.getPatientByCode);
router.get("/patients/ID/:code", patientController.getPatientIDByCode);
// Get a specific patient by ID
router.get("/patients/lastCard/:patientId", patientController.getLastValidCard);

// Update a patient by ID
router.put("/patients/:patientId", patientController.updatePatient);

// Delete a patient by ID
router.delete("/patients/:patientId", patientController.deletePatient);

// Create a new card for a specific patient
router.post(
  "/patients/:patientID/cards",
  patientController.createCardForPatient
);

module.exports = router;
