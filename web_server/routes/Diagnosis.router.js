// routes/bloodPressureRoutes.js

const express = require("express");
const router = express.Router();
const DiagnosisController = require("../controllers/Diagnosis.controller");

// Create a new heart rate entry
router.post("/diagnosis", DiagnosisController.createDiagnosis);
router.get("/diagnosis/doctor", DiagnosisController.doctorGetPatientDiagnosis);

module.exports = router;
