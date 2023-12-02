// models/Patient.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  doctor: { type: String, required: true },
  patientID: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  trigger: { type: String, required: true },
  seen: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: new Date() },
  criticality: { type: Number, required: true, default: 1 },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
