const mongoose = require("mongoose");

const diseaseCaughtSchema = new mongoose.Schema({
  notes: {
    type: String,
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
  disease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Disease",
    required: true,
  },
  diseaseName: {
    type: String,
    required: true,
  },
});

const DiseaseCaught = mongoose.model("DiseaseCaught", diseaseCaughtSchema);

module.exports = DiseaseCaught;
