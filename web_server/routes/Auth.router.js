const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller");

router.post("/doctors/auth", authController.authenticateDoctor);
router.post("/patients/auth", authController.authenticatePatient);
//don't use these 2
router.post("/patients", authController.registerPatient);
router.post("/doctors", authController.registerDoctor);
//use these 2 instead
router.post("/doctorsEnc", authController.registerDoctor);
router.post("/patientsEnc", authController.registerPatientEncrypted);

router.get("/patients/data", authController.getPatientData);
router.get("/doctors/data", authController.getDoctorData);

module.exports = router;
