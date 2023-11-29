const mongoose = require("mongoose");

const allergyCaughtSchema = new mongoose.Schema({
  notes: {
    type: String,
    required: true,
    default: "",
  },
  severity: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
    max: 3,
  },
  cured: {
    type: Boolean,
    required: true,
    default: false,
  },
  diagnosis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Diagnosis",
    required: true,
  },
  allergy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Allergy",
    required: true,
  },
  allergyName: {
    type: String,
    required: true,
  },
});

const AllergyCaught = mongoose.model("AllergyCaught", allergyCaughtSchema);

module.exports = AllergyCaught;
