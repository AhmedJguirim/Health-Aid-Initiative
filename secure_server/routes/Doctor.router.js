const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/Doctor.controller");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const highlightController = require("../controllers/Highlight.controller");

// Route to create a new doctor
router.post("/doctors", doctorController.createDoctor);
router.post("/doctorsEnc", doctorController.createDoctorEncrypted);

// Route for doctor authentication
router.post("/doctors/authenticate", doctorController.authenticateDoctor);

// Routes that require JWT authentication
// router.use(jwtMiddleware.verifyAccessToken);

// Route to get details of a specific doctor
router.get("/doctors/:doctorID", doctorController.getDoctorDetails);

// Route to update details of a specific doctor
router.put("/doctors/:doctorID", doctorController.updateDoctorDetails);

// Route to delete a specific doctor
router.delete("/doctors/:doctorID", doctorController.deleteDoctor);

router.post("/doctor/speciality", doctorController.addSpecialityToDoctor);
router.post("/speciality", doctorController.addSpeciality);
router.get("/doctor/search", doctorController.searchDoctorByName);
router.get("/doctor/search/email", doctorController.searchDoctorByEmail);

router.post("/highlights", highlightController.createHighlight);
router.get("/highlights", highlightController.getHighlightedPatients);

module.exports = router;
