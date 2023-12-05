// schemas/Prescription.schema.js

const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  doctorID: {
    type: String,
    required: true,
  },
  patientID: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  medListings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedListing",
    },
  ],
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
