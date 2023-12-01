// models/Patient.js

const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema({
  doctor: { type: String, required: true },
  patientID: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  trigger: { type: String, required: true },
  seen: { type: Boolean, required: true, default: false },
});

const Highlight = mongoose.model("Heighlight", highlightSchema);

module.exports = Highlight;
