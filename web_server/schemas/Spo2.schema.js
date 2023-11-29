const mongoose = require("mongoose");

const spo2Schema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
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

const SpO2 = mongoose.model("SpO2", spo2Schema);

module.exports = SpO2;
