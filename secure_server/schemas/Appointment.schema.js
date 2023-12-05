const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  appointmentID: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  duration: {
    type: Number, // Assuming duration is in minutes
    required: true,
    default: 0,
  },
  notes: {
    type: String,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
