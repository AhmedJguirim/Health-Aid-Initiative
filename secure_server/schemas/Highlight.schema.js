// models/Patient.js

const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
});

const Highlight = mongoose.model("Heighlight", highlightSchema);

module.exports = Highlight;
