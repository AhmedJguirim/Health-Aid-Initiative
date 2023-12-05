const mongoose = require("mongoose");

const dosageSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  timeOfDay: {
    type: String,
    enum: ["morning", "midday", "night"],
    required: true,
  },
  taken: {
    type: Boolean,
    default: false,
  },
  medListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedListing",
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  alarms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alarm" }],
});

const Dosage = mongoose.model("Dosage", dosageSchema);

module.exports = Dosage;
