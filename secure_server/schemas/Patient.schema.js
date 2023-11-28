// models/Patient.js

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  responsiblePhoneNumber: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  CIN: {
    type: String,
    required: true,
    unique: true,
  },

  bloodType: {
    type: String,
    required: true,
  },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
