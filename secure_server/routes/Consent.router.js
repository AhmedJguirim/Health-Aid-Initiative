const express = require("express");
const router = express.Router();
const consentController = require("../controllers/Consent.controller");

// Route to create a new consent
router.post("/consents", consentController.createConsent);

router.get("/consents/doctor/:doctorId", consentController.getConsentsOfDoc);
router.get(
  "/consents/doctorPatient/:doctor/:patient",
  consentController.getConsentOfdocPatient
);
router.get(
  "/consents/doctorPatient/add/:doctor/:patient",
  consentController.getConsentOfdocPatientAdd
);

// Route to get details of a specific consent
router.get("/consents/:consentID", consentController.getConsentDetails);

// Route to update details of a specific consent
router.put("/consents/:consentID", consentController.updateConsentDetails);

// Route to delete a specific consent
router.delete("/consents/:doctor", consentController.deleteConsent);

module.exports = router;
