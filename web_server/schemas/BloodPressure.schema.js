const mongoose = require("mongoose");

const bloodPressureSchema = new mongoose.Schema({
  systolic: {
    type: Number,
    required: true,
    min: 0,
  },
  diastolic: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  patientID: {
    type: String,
    required: true,
  },
});

const BloodPressure = mongoose.model("BloodPressure", bloodPressureSchema);

module.exports = BloodPressure;
