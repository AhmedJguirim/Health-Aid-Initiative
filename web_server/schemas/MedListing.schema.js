const mongoose = require("mongoose");

const medListingSchema = new mongoose.Schema({
  isCritical: {
    type: Boolean,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  alternativeMedicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    required: true,
  },
  dosages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dosage",
    },
  ],
});

const MedListing = mongoose.model("MedListing", medListingSchema);

module.exports = MedListing;
