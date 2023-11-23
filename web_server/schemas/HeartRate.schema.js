// models/HeartRate.js

const mongoose = require("mongoose");

const heartRateSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
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

const HeartRate = mongoose.model("HeartRate", heartRateSchema);

module.exports = HeartRate;
