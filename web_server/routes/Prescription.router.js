// Route: Create a prescription
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const PrescriptionController = require("../controllers/Prescription.controller");

router.post(
  "/prescriptions/:patient",
  PrescriptionController.createPrescription
);

module.exports = router;
