const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
  appointmentID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

module.exports = Diagnosis;
