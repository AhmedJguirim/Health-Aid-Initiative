const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.controller");

router.post("/doctors/auth", authController.authenticateDoctor);
router.post("/patients/auth", authController.authenticatePatient);
router.post("/patients", authController.registerPatient);
router.post("/doctors", authController.registerDoctor);

module.exports = router;
