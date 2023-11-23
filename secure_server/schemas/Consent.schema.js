const mongoose = require("mongoose");
const { Schema } = mongoose;

const consentSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  add: {
    type: Boolean,
    default: false,
  },
  view: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: -1, // -1 for infinite duration
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});

const Consent = mongoose.model("Consent", consentSchema);

module.exports = Consent;
