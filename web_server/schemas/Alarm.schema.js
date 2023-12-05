const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  isStopped: {
    type: Boolean,
    default: false,
  },
  dosage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dosage",
    required: true,
  },
  patientID: {
    type: String,
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
});

const Alarm = mongoose.model("Alarm", alarmSchema);

module.exports = Alarm;
