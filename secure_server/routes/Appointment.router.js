const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/Appointment.controller");

// Create a new appointment
router.post("/", appointmentController.createAppointment);

// Get details of a specific appointment
router.get("/:appointmentID", appointmentController.getAppointmentDetails);

// Get all appointments for a specific doctor
router.get("/doctor/:doctorID", appointmentController.getAppointmentsByDoctor);

// Get all appointments for a specific patient
router.get(
  "/patient/:patientID",
  appointmentController.getAppointmentsByPatient
);

// Update an existing appointment
router.put("/:appointmentID/update", appointmentController.updateAppointment);

// Delete an appointment
router.delete(
  "/:appointmentID/delete",
  appointmentController.deleteAppointment
);

module.exports = router;
