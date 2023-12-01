// models/Temperature.js

const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
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

const Temperature = mongoose.model("Temperature", temperatureSchema);

module.exports = Temperature;
